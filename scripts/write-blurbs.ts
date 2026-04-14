import { readFileSync, writeFileSync, existsSync, renameSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { computeChangeSet, type PreviousManifest } from './lib/change-set.ts';
import { contentHash } from './lib/hash.ts';
import { stableStringify } from './lib/sort-keys.ts';
import type { Snapshot } from './curate.ts';

const SNAPSHOT_PATH = 'data/github-snapshot.json';
const MANIFEST_PATH = 'data/build-manifest.json';
const CACHE_PATH = 'data/ai-cache.json';
const REQUESTS_PATH = 'data/blurb-requests.json';

type CacheEntry = {
	slug: string;
	shortDescription: string;
	longDescription: string;
	quotedSpans: string[];
	model: string;
	generatedAt: string;
};

type Cache = Record<string, CacheEntry>;

type BlurbRequest = {
	slug: string;
	contentHash: string;
	readmeExcerpt: string;
	description: string;
	topics: string[];
	primaryLanguage: string | null;
};

type RequestsManifest = {
	generatedAt: string;
	changeSet: { added: string[]; modified: string[]; removed: string[]; unchangedCount: number };
	requests: BlurbRequest[];
	reusedFromCache: string[];
	missingFromCache: string[];
};

function slugify(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function atomicWrite(path: string, content: string) {
	mkdirSync(dirname(path), { recursive: true });
	const tmp = `${path}.tmp`;
	writeFileSync(tmp, content);
	renameSync(tmp, path);
}

function loadCache(): Cache {
	if (!existsSync(CACHE_PATH)) return {};
	try {
		const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
		if (raw && typeof raw === 'object') return raw as Cache;
	} catch {
		/* fall through */
	}
	return {};
}

function main() {
	const changeSetOnly = process.argv.includes('--change-set-only');

	if (!existsSync(SNAPSHOT_PATH)) {
		console.error('ERR_NO_SNAPSHOT');
		console.error('Run: npm run refresh:fetch first');
		process.exit(3);
	}

	const snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as Snapshot;
	const previousManifest: PreviousManifest = existsSync(MANIFEST_PATH)
		? (JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as PreviousManifest)
		: {};
	const cache = loadCache();

	const changeSet = computeChangeSet(snapshot, previousManifest);

	const requests: BlurbRequest[] = [];
	const reusedFromCache: string[] = [];
	const missingFromCache: string[] = [];

	const slugToRepo = new Map(snapshot.repos.map((r) => [slugify(r.name), r]));

	const targetSlugs = changeSetOnly
		? [...changeSet.added, ...changeSet.modified]
		: snapshot.repos.map((r) => slugify(r.name));

	for (const slug of targetSlugs) {
		const repo = slugToRepo.get(slug);
		if (!repo) continue;
		const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);
		const hash = contentHash(
			repo.description ?? '',
			JSON.stringify(topics),
			repo.readme?.text ?? '',
			repo.pushedAt,
		);

		if (cache[hash]) {
			reusedFromCache.push(slug);
			continue;
		}

		requests.push({
			slug,
			contentHash: hash,
			readmeExcerpt: (repo.readme?.text ?? '').slice(0, 2000),
			description: repo.description ?? '',
			topics,
			primaryLanguage: repo.primaryLanguage?.name ?? null,
		});
	}

	for (const slug of changeSet.unchanged) {
		const repo = slugToRepo.get(slug);
		if (!repo) continue;
		const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);
		const hash = contentHash(
			repo.description ?? '',
			JSON.stringify(topics),
			repo.readme?.text ?? '',
			repo.pushedAt,
		);
		if (!cache[hash]) missingFromCache.push(slug);
	}

	const manifest: RequestsManifest = {
		generatedAt: new Date().toISOString(),
		changeSet: {
			added: changeSet.added,
			modified: changeSet.modified,
			removed: changeSet.removed,
			unchangedCount: changeSet.unchanged.length,
		},
		requests,
		reusedFromCache,
		missingFromCache,
	};

	atomicWrite(REQUESTS_PATH, stableStringify(manifest));

	console.log(
		`Blurb requests: ${requests.length} new (${changeSet.added.length} added, ${changeSet.modified.length} modified), ` +
			`${reusedFromCache.length} reused from cache, ${missingFromCache.length} unchanged-but-missing-cache.`,
	);
	console.log(`Wrote ${REQUESTS_PATH}`);
	if (missingFromCache.length > 0) {
		console.log('Note: unchanged repos missing cache entries will render with empty long descriptions.');
		console.log('      Consider running without --change-set-only to refresh them.');
	}
}

main();
