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
	category: z.enum(['library', 'plugin', 'cli', 'service', 'utility', 'app', 'demo']),
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

function isRelativeUrl(url: string): boolean {
	const u = url.trim();
	if (!u) return false;
	// Absolute (has a scheme), protocol-relative, in-page anchor, or mail/tel → leave alone.
	return !/^([a-z][a-z0-9+.-]*:|\/\/|#|mailto:|tel:)/i.test(u);
}

// Rewrite relative URLs in a README-derived markdown fragment to absolute GitHub
// URLs. README install sections routinely reference repo-relative images (e.g.
// `./docs/demo.gif`) and files; left relative, Astro tries to resolve them as
// local build assets and fails. Images point at raw.githubusercontent, other
// links at the GitHub blob view — both pinned to the repo's default branch.
function absolutizeReadmeUrls(md: string, repoUrl: string, branch: string): string {
	const m = /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/i.exec(repoUrl);
	if (!m) return md;
	const [, owner, repo] = m;
	const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
	const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}/`;
	const join = (base: string, rel: string) => base + rel.replace(/^\.?\/+/, '');

	let out = md;
	// markdown images: ![alt](url …)
	out = out.replace(/(!\[[^\]]*\]\(\s*)([^)\s]+)/g, (full, pre, url) =>
		isRelativeUrl(url) ? pre + join(rawBase, url) : full,
	);
	// markdown links: [text](url …) — not an image (not preceded by '!')
	out = out.replace(/(^|[^!])(\[[^\]]*\]\(\s*)([^)\s]+)/g, (full, lead, pre, url) =>
		isRelativeUrl(url) ? lead + pre + join(blobBase, url) : full,
	);
	// raw HTML <img src="…">
	out = out.replace(/(<img\b[^>]*?\bsrc\s*=\s*["'])([^"']+)(["'])/gi, (full, pre, url, post) =>
		isRelativeUrl(url) ? pre + join(rawBase, url) + post : full,
	);
	// raw HTML <a href="…">
	out = out.replace(/(<a\b[^>]*?\bhref\s*=\s*["'])([^"']+)(["'])/gi, (full, pre, url, post) =>
		isRelativeUrl(url) ? pre + join(blobBase, url) + post : full,
	);
	return out;
}

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
	const validated: Array<{ project: ReturnType<typeof buildProject>; slug: string; installSection?: string }> = [];

	for (const cp of curated) {
		const project = buildProject(cp, snapshot.fetchedAt, aiCache);
		const parsed = ProjectSchema.safeParse(project);
		if (!parsed.success) {
			errors.push(`${cp.slug}: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
			continue;
		}
		const { installSection } = parseReadme(cp.raw.readme?.text ?? '');
		const branch = cp.raw.defaultBranchRef?.name ?? 'main';
		const resolvedInstall = installSection
			? absolutizeReadmeUrls(installSection, cp.raw.url, branch)
			: undefined;
		validated.push({ project, slug: cp.slug, installSection: resolvedInstall });
	}

	if (errors.length > 0) {
		console.error('ERR_SCHEMA_VALIDATE');
		for (const e of errors) console.error('  ' + e);
		process.exit(4);
	}

	let rendered = 0;
	let skipped = 0;
	const keepSlugs = new Set<string>();

	for (const { project, slug, installSection } of validated) {
		keepSlugs.add(slug);
		// Body = verbose long description, followed by the repo's README
		// `## Installation` section (verbatim) as the final section. Astro
		// compiles this markdown body to HTML when the page renders.
		const sections: string[] = [];
		if (project.description.long) sections.push(project.description.long);
		if (installSection) sections.push(installSection);
		const body = sections.length ? `${sections.join('\n\n')}\n` : '';
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
