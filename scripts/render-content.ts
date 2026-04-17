import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync, renameSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'astro/zod';
import matter from 'gray-matter';
import { curate, type Snapshot, type Overrides, type CuratedProject } from './curate.ts';
import { parseReadme } from '../src/lib/readme-parse.ts';

import { contentHash } from './lib/hash.ts';

const SNAPSHOT_PATH = 'data/github-snapshot.json';
const FEATURED_PATH = 'site/featured.json';
const CONTENT_DIR = 'src/content/projects';
const AI_CACHE_PATH = 'data/ai-cache.json';

type CachedBlurb = { shortDescription: string; longDescription: string };

function loadAiCache(): Record<string, CachedBlurb> {
	if (!existsSync(AI_CACHE_PATH)) return {};
	try {
		const raw = JSON.parse(readFileSync(AI_CACHE_PATH, 'utf8'));
		if (raw && typeof raw === 'object') return raw as Record<string, CachedBlurb>;
	} catch {
		/* fall through */
	}
	return {};
}

const ProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	tagline: z.string().max(160),
	description: z.object({
		short: z.string(),
		long: z.string(),
	}),
	banner: z
		.object({
			src: z.string(),
			alt: z.string(),
			source: z.enum(['repo', 'local', 'generated']),
		})
		.optional(),
	topics: z.array(z.string()),
	category: z.enum(['library', 'tool', 'app', 'demo']),
	theme: z.enum(['nlp', 'infra', 'agents', 'obsidian', 'utilities']).optional(),
	primaryLanguage: z.string().optional(),
	languages: z.array(
		z.object({
			name: z.string(),
			percent: z.number(),
		}),
	),
	stars: z.number(),
	npm: z
		.object({
			package: z.string(),
			url: z.string(),
		})
		.optional(),
	links: z.object({
		repo: z.string(),
		demo: z.string().optional(),
		docs: z.string().optional(),
		homepage: z.string().optional(),
	}),
	featured: z.boolean().default(false),
	sortOrder: z.number().default(100),
	status: z.enum(['active', 'archived', 'hidden']).default('active'),
	lastCommit: z.string().datetime().optional(),
	_source: z.object({
		repo: z.string(),
		sha: z.string(),
		fetchedAt: z.string(),
	}),
});

function truncateTagline(src: string): string {
	const cleaned = src.replace(/\s+/g, ' ').trim();
	if (cleaned.length <= 160) return cleaned;
	return cleaned.slice(0, 157).trimEnd() + '...';
}

function buildProject(cp: CuratedProject, snapshotFetchedAt: string, aiCache: Record<string, CachedBlurb>) {
	const repo = cp.raw;
	const readme = parseReadme(repo.readme?.text ?? '');
	const tagline = truncateTagline(readme.tagline ?? repo.description ?? cp.name);

	const topics = cp.topics;
	const cacheKey = contentHash(
		repo.description ?? '',
		JSON.stringify(topics),
		repo.readme?.text ?? '',
		repo.pushedAt,
	);
	const cached = aiCache[cacheKey];

	const languages = repo.languages.edges.map((e) => ({
		name: e.node.name,
		percent: repo.languages.totalSize > 0
			? Math.round((e.size / repo.languages.totalSize) * 10000) / 100
			: 0,
	}));

	const links: Record<string, string> = { repo: repo.url };
	if (readme.demos[0]) links.demo = readme.demos[0].url;
	if (repo.homepageUrl) links.homepage = repo.homepageUrl;

	const banner = readme.hero
		? { src: readme.hero, alt: `${cp.name} banner`, source: 'repo' as const }
		: undefined;

	return {
		id: cp.slug,
		name: cp.name,
		slug: cp.slug,
		tagline,
		description: {
			short: cached?.shortDescription ?? repo.description ?? '',
			long: cached?.longDescription ?? '',
		},
		...(banner ? { banner } : {}),
		topics: cp.topics,
		category: cp.category,
		...(cp.theme ? { theme: cp.theme } : {}),
		...(repo.primaryLanguage ? { primaryLanguage: repo.primaryLanguage.name } : {}),
		languages,
		stars: repo.stargazerCount,
		links,
		featured: cp.featured,
		sortOrder: cp.sortOrder,
		status: 'active' as const,
		lastCommit: repo.pushedAt,
		_source: {
			repo: repo.url,
			sha: 'HEAD',
			fetchedAt: snapshotFetchedAt,
		},
	};
}

function atomicWrite(path: string, content: string) {
	const tmp = `${path}.tmp`;
	writeFileSync(tmp, content);
	renameSync(tmp, path);
}

function main() {
	if (!existsSync(SNAPSHOT_PATH)) {
		console.error('ERR_NO_SNAPSHOT');
		console.error('Run: npm run refresh:fetch first');
		process.exit(3);
	}

	const snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as Snapshot;
	const overrides = JSON.parse(readFileSync(FEATURED_PATH, 'utf8')) as Overrides;

	if (!snapshot.repos) {
		console.error('ERR_NO_SNAPSHOT');
		console.error('Snapshot appears empty. Run: npm run refresh:fetch');
		process.exit(3);
	}

	const curated = curate(snapshot, overrides);
	const aiCache = loadAiCache();

	mkdirSync(CONTENT_DIR, { recursive: true });

	const errors: string[] = [];
	const validated: Array<{ project: ReturnType<typeof buildProject>; slug: string }> = [];

	for (const cp of curated) {
		const project = buildProject(cp, snapshot.fetchedAt, aiCache);
		const parsed = ProjectSchema.safeParse(project);
		if (!parsed.success) {
			errors.push(`${cp.slug}: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
			continue;
		}
		validated.push({ project, slug: cp.slug });
	}

	if (errors.length > 0) {
		console.error('ERR_SCHEMA_VALIDATE');
		for (const e of errors) console.error('  ' + e);
		process.exit(4);
	}

	let rendered = 0;
	let skipped = 0;
	const keepSlugs = new Set<string>();

	for (const { project, slug } of validated) {
		keepSlugs.add(slug);
		const body = project.description.long ? `${project.description.long}\n` : '';
		const md = matter.stringify(body, project);
		const outPath = join(CONTENT_DIR, `${slug}.md`);
		if (existsSync(outPath)) {
			const existing = readFileSync(outPath, 'utf8');
			if (existing === md) {
				skipped++;
				continue;
			}
		}
		atomicWrite(outPath, md);
		rendered++;
	}

	let removed = 0;
	if (existsSync(CONTENT_DIR)) {
		for (const file of readdirSync(CONTENT_DIR)) {
			if (!file.endsWith('.md')) continue;
			const slug = file.replace(/\.md$/, '');
			if (!keepSlugs.has(slug)) {
				unlinkSync(join(CONTENT_DIR, file));
				removed++;
			}
		}
	}

	console.log(`Rendered ${rendered}, skipped ${skipped} (unchanged), removed ${removed} obsolete`);
}

main();
