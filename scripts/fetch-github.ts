import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import { graphql } from '@octokit/graphql';
import { USER_REPOS_QUERY } from './lib/graphql-queries.ts';
import { stableStringify } from './lib/sort-keys.ts';

const OWNER = 'jparkerweb';
const OUT_PATH = 'data/github-snapshot.json';

// Resilience tuning for GitHub's GraphQL API. The repos query is heavy (full
// README text × 100 repos/page), and GitHub periodically times out on it,
// returning a transient 502/503/504. Retry those with exponential backoff.
const MAX_ATTEMPTS = 5; // total tries per page before giving up
const BASE_DELAY_MS = 1000; // first backoff; doubles each retry
const MAX_DELAY_MS = 15000; // backoff ceiling
const PAGE_PAUSE_MS = 500; // polite pause between successful pages

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Decide whether a failed GraphQL request is worth retrying. Transient =
 * gateway/timeout/connection errors and secondary rate limits. Anything that
 * looks like bad credentials or a malformed query is fatal — retrying wastes
 * time and (for rate limits) digs the hole deeper.
 */
function isTransient(err: unknown): boolean {
	const e = err as { status?: number; message?: string; code?: string };
	const status = e?.status;
	if (status === 502 || status === 503 || status === 504) return true;
	if (status === 401 || status === 403) {
		// 403 is usually bad scope/credentials — fatal — UNLESS it's a
		// secondary/abuse rate limit, which is transient.
		return /rate limit|secondary|abuse/i.test(e?.message ?? '');
	}
	const code = e?.code ?? '';
	if (['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED'].includes(code)) {
		return true;
	}
	// The HTML 502 page from nginx surfaces as a plain message, not a status.
	return /502|503|504|bad gateway|gateway time-?out|service unavailable|timeout|socket hang up/i.test(
		e?.message ?? ''
	);
}

type Repo = {
	name: string;
	description: string | null;
	url: string;
	homepageUrl: string | null;
	stargazerCount: number;
	forkCount: number;
	primaryLanguage: { name: string; color: string } | null;
	languages: {
		edges: Array<{ size: number; node: { name: string } }>;
		totalSize: number;
	};
	repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
	licenseInfo: { spdxId: string } | null;
	pushedAt: string;
	updatedAt: string;
	createdAt: string;
	issues: { totalCount: number };
	isArchived: boolean;
	isFork: boolean;
	readme: { text: string } | null;
};

type QueryResponse = {
	user: {
		login: string;
		name: string | null;
		bio: string | null;
		avatarUrl: string;
		url: string;
		repositories: {
			pageInfo: { hasNextPage: boolean; endCursor: string | null };
			nodes: Repo[];
		};
	};
};

function getToken(): string {
	try {
		const token = execSync('gh auth token', { encoding: 'utf8' }).trim();
		if (!token) {
			console.error('ERR_GH_AUTH');
			console.error('Run: gh auth login -s repo');
			process.exit(1);
		}
		return token;
	} catch {
		console.error('ERR_GH_AUTH');
		console.error('Run: gh auth login -s repo');
		process.exit(1);
	}
}

async function fetchAll(token: string) {
	const client = graphql.defaults({
		headers: { authorization: `token ${token}` },
	});

	let profile: QueryResponse['user'] | null = null;
	const allRepos: Repo[] = [];
	let cursor: string | null = null;
	let page = 0;

	process.stderr.write(`→ Fetching repositories for @${OWNER} from GitHub…\n`);

	while (true) {
		page++;
		let response: QueryResponse | null = null;

		for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
			try {
				response = await client<QueryResponse>(USER_REPOS_QUERY, {
					login: OWNER,
					cursor,
				});
				break; // success
			} catch (err) {
				const last = attempt === MAX_ATTEMPTS;
				if (last || !isTransient(err)) {
					console.error('ERR_GRAPHQL');
					console.error((err as Error).message);
					process.exit(2);
				}
				const delay = Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
				const jitter = Math.floor(Math.random() * 250);
				const wait = delay + jitter;
				console.warn(
					`Transient GraphQL error (attempt ${attempt}/${MAX_ATTEMPTS}), retrying in ${wait}ms: ${(err as Error).message.split('\n')[0]}`
				);
				await sleep(wait);
			}
		}

		// Unreachable in practice — the loop either breaks on success or
		// process.exit()s on failure — but keeps the type checker happy.
		if (!response) {
			console.error('ERR_GRAPHQL');
			console.error('exhausted retries without a response');
			process.exit(2);
		}

		if (!profile) profile = response.user;
		const batch = response.user.repositories.nodes;
		allRepos.push(...batch);

		const hasMore = response.user.repositories.pageInfo.hasNextPage;
		process.stderr.write(
			`  page ${page}: +${batch.length} repos (${allRepos.length} total)${hasMore ? ', fetching more…' : ''}\n`
		);

		if (!hasMore) break;
		cursor = response.user.repositories.pageInfo.endCursor;
		await sleep(PAGE_PAUSE_MS); // be polite between pages
	}

	process.stderr.write(`✓ Fetched ${allRepos.length} repositories across ${page} page(s)\n`);

	return { profile: profile!, repos: allRepos };
}

async function main() {
	const dryRun = process.argv.includes('--dry-run');
	const token = getToken();
	const { profile, repos } = await fetchAll(token);

	const filtered = repos.filter((r) => !r.isArchived && !r.isFork);
	const excluded = repos.length - filtered.length;
	process.stderr.write(
		`  filtered ${repos.length} → ${filtered.length} (excluded ${excluded} archived/forks)\n`
	);

	if (dryRun) {
		console.log(`Total repos fetched: ${repos.length}`);
		console.log(`After filter (non-archived, non-fork): ${filtered.length}`);
		console.log('First 3:');
		for (const r of filtered.slice(0, 3)) {
			console.log(`  - ${r.name}`);
		}
		return;
	}

	const canonicalPayload = {
		profile: {
			login: profile.login,
			name: profile.name,
			bio: profile.bio,
			avatarUrl: profile.avatarUrl,
			url: profile.url,
		},
		repos: filtered,
	};
	const canonicalHash = stableStringify(canonicalPayload);

	let fetchedAt = new Date().toISOString();
	if (existsSync(OUT_PATH)) {
		try {
			const existing = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
			const existingCanonical = stableStringify({
				profile: existing.profile,
				repos: existing.repos,
			});
			if (existingCanonical === canonicalHash && typeof existing.fetchedAt === 'string') {
				fetchedAt = existing.fetchedAt;
			}
		} catch {
			/* fall through and rewrite */
		}
	}

	const snapshot = {
		fetchedAt,
		...canonicalPayload,
	};

	mkdirSync(dirname(OUT_PATH), { recursive: true });
	const tmp = `${OUT_PATH}.tmp`;
	writeFileSync(tmp, stableStringify(snapshot));
	renameSync(tmp, OUT_PATH);

	console.log(`Wrote ${OUT_PATH} with ${filtered.length} repos`);
}

main().catch((err) => {
	console.error('ERR_GRAPHQL');
	console.error(err);
	process.exit(2);
});
