import { matchesAny } from './lib/match-pattern.ts';

type RawRepo = {
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

export type Snapshot = {
	fetchedAt: string;
	profile: { login: string; name: string | null; bio: string | null; avatarUrl: string; url: string };
	repos: RawRepo[];
};

export type Overrides = {
	featured: string[];
	pinned: string[];
	hidden: string[];
	hideTopics: string[];
	order: Record<string, number>;
};

export type CuratedProject = {
	raw: RawRepo;
	name: string;
	slug: string;
	topics: string[];
	featured: boolean;
	pinned: boolean;
	sortOrder: number;
	category: 'library' | 'tool' | 'app' | 'demo';
	theme?: 'nlp' | 'infra' | 'agents' | 'obsidian' | 'utilities';
};

function slugify(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function deriveCategory(repo: RawRepo, topics: string[]): CuratedProject['category'] {
	const name = repo.name.toLowerCase();
	const topicSet = new Set(topics.map((t) => t.toLowerCase()));
	if (topicSet.has('npm') || topicSet.has('npm-package') || topicSet.has('library')) return 'library';
	if (topicSet.has('obsidian-plugin') || topicSet.has('obsidian')) return 'tool';
	if (name.endsWith('-app') || repo.homepageUrl) return 'app';
	return 'demo';
}

function deriveTheme(topics: string[]): CuratedProject['theme'] {
	const joined = topics.join(' ').toLowerCase();
	if (/(embedding|chunking|nlp|semantic)/.test(joined)) return 'nlp';
	if (/(bedrock|proxy|wrapper|llm)/.test(joined)) return 'infra';
	if (/(mcp|agent|assistant)/.test(joined)) return 'agents';
	if (/obsidian/.test(joined)) return 'obsidian';
	return 'utilities';
}

export function curate(snapshot: Snapshot, overrides: Overrides): CuratedProject[] {
	let excludedHidden = 0;
	let excludedHideTopics = 0;
	let excludedArchived = 0;
	let excludedFork = 0;

	const kept: CuratedProject[] = [];

	for (const repo of snapshot.repos) {
		if (repo.isArchived) {
			excludedArchived++;
			continue;
		}
		if (repo.isFork) {
			excludedFork++;
			continue;
		}
		const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);
		if (matchesAny(repo.name, overrides.hidden)) {
			excludedHidden++;
			continue;
		}
		if (topics.some((t) => overrides.hideTopics.includes(t))) {
			excludedHideTopics++;
			continue;
		}

		const featuredByName = overrides.featured.includes(repo.name);
		const featuredByTopic = topics.includes('equill-featured');
		const featured = featuredByName || featuredByTopic;
		const pinned = overrides.pinned.includes(repo.name);

		let sortOrder: number;
		if (overrides.order[repo.name] !== undefined) {
			sortOrder = overrides.order[repo.name];
		} else if (featuredByName) {
			sortOrder = overrides.featured.indexOf(repo.name);
		} else if (featured) {
			sortOrder = overrides.featured.length;
		} else {
			sortOrder = 1000 - repo.stargazerCount;
		}

		kept.push({
			raw: repo,
			name: repo.name,
			slug: slugify(repo.name),
			topics,
			featured,
			pinned,
			sortOrder,
			category: deriveCategory(repo, topics),
			theme: deriveTheme(topics),
		});
	}

	kept.sort((a, b) => {
		if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
		if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
		return a.name.localeCompare(b.name);
	});

	console.log(
		`excluded ${excludedHidden + excludedHideTopics + excludedArchived + excludedFork} repos ` +
			`(hidden: ${excludedHidden}, hideTopics: ${excludedHideTopics}, archived: ${excludedArchived}, fork: ${excludedFork})`,
	);

	return kept;
}
