import { contentHash } from './hash.ts';
import type { Snapshot } from '../curate.ts';

export type ChangeSet = {
	added: string[];
	modified: string[];
	removed: string[];
	unchanged: string[];
};

export type PreviousManifest = {
	projects?: Record<string, { contentHash: string }>;
};

function slugify(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function computeChangeSet(newSnapshot: Snapshot, previousManifest: PreviousManifest): ChangeSet {
	const added: string[] = [];
	const modified: string[] = [];
	const unchanged: string[] = [];
	const seen = new Set<string>();

	const previous = previousManifest.projects ?? {};

	for (const repo of newSnapshot.repos) {
		const slug = slugify(repo.name);
		seen.add(slug);
		const topics = repo.repositoryTopics.nodes.map((n) => n.topic.name);
		const hash = contentHash(
			repo.description ?? '',
			JSON.stringify(topics),
			repo.readme?.text ?? '',
			repo.pushedAt,
		);
		const prev = previous[slug];
		if (!prev) {
			added.push(slug);
		} else if (prev.contentHash !== hash) {
			modified.push(slug);
		} else {
			unchanged.push(slug);
		}
	}

	const removed: string[] = [];
	for (const slug of Object.keys(previous)) {
		if (!seen.has(slug)) removed.push(slug);
	}

	return { added, modified, removed, unchanged };
}
