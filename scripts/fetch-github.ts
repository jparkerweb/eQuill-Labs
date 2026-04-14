import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import { graphql } from '@octokit/graphql';
import { USER_REPOS_QUERY } from './lib/graphql-queries.ts';
import { stableStringify } from './lib/sort-keys.ts';

const OWNER = 'jparkerweb';
const OUT_PATH = 'data/github-snapshot.json';

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

	while (true) {
		let response: QueryResponse;
		try {
			response = await client<QueryResponse>(USER_REPOS_QUERY, {
				login: OWNER,
				cursor,
			});
		} catch (err) {
			console.error('ERR_GRAPHQL');
			console.error((err as Error).message);
			process.exit(2);
		}

		if (!profile) profile = response.user;
		allRepos.push(...response.user.repositories.nodes);

		if (!response.user.repositories.pageInfo.hasNextPage) break;
		cursor = response.user.repositories.pageInfo.endCursor;
	}

	return { profile: profile!, repos: allRepos };
}

async function main() {
	const dryRun = process.argv.includes('--dry-run');
	const token = getToken();
	const { profile, repos } = await fetchAll(token);

	const filtered = repos.filter((r) => !r.isArchived && !r.isFork);

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
