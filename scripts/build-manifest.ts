import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { curate, type Snapshot, type Overrides } from './curate.ts';
import { contentHash } from './lib/hash.ts';
import { stableStringify } from './lib/sort-keys.ts';

const SNAPSHOT_PATH = 'data/github-snapshot.json';
const FEATURED_PATH = 'site/featured.json';
const MANIFEST_PATH = 'data/build-manifest.json';

export function writeManifest() {
	if (!existsSync(SNAPSHOT_PATH)) {
		console.error('ERR_NO_SNAPSHOT');
		process.exit(3);
	}
	const snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as Snapshot;
	const overrides = JSON.parse(readFileSync(FEATURED_PATH, 'utf8')) as Overrides;
	const curated = curate(snapshot, overrides);

	const sources = snapshot.repos
		.map((r) => ({
			repo: r.url,
			sha: 'HEAD',
			fetchedAt: snapshot.fetchedAt,
		}))
		.sort((a, b) => a.repo.localeCompare(b.repo));

	const projects = curated
		.map((cp) => {
			const topics = cp.topics;
			const hash = contentHash(
				cp.raw.description ?? '',
				JSON.stringify(topics),
				cp.raw.readme?.text ?? '',
				cp.raw.pushedAt,
			);
			const hasOverride =
				overrides.featured.includes(cp.name) ||
				overrides.pinned.includes(cp.name) ||
				overrides.order[cp.name] !== undefined;
			return { slug: cp.slug, contentHash: hash, hasOverride };
		})
		.sort((a, b) => a.slug.localeCompare(b.slug));

	const inputsHash = contentHash(
		stableStringify(sources),
		stableStringify(overrides),
	);

	const manifest = {
		buildId: randomUUID(),
		builtAt: new Date().toISOString(),
		generator: { name: 'refresh-portfolio', version: '1.0.0' },
		skillVersion: null,
		aiModel: null,
		sources,
		projects,
		inputsHash,
	};

	const tmp = `${MANIFEST_PATH}.tmp`;
	writeFileSync(tmp, stableStringify(manifest));
	renameSync(tmp, MANIFEST_PATH);
	console.log(`Wrote ${MANIFEST_PATH} (${projects.length} projects)`);
}

const isMainModule = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('build-manifest.ts');
if (isMainModule) {
	writeManifest();
}
