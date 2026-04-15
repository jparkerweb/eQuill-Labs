import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString as mdToString } from 'mdast-util-to-string';
import type { Root, Content, Image, Link, Code, Heading, List, Paragraph } from 'mdast';

export type ReadmeExtract = {
	hero?: string;
	tagline?: string;
	features: string[];
	demos: Array<{ label: string; url: string }>;
	install?: string;
};

const FEATURE_HEADING = /features|why|highlights/i;
const DEMO_TEXT = /demo|live|playground|try it/i;
const INSTALL_LINE = /^(npm|pnpm|yarn|bun|npx)\s+/;

export function parseReadme(markdown: string): ReadmeExtract {
	const result: ReadmeExtract = { features: [], demos: [] };
	if (!markdown || typeof markdown !== 'string') return result;

	let tree: Root;
	try {
		tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
	} catch {
		return result;
	}

	const children = tree.children as Content[];

	// hero: first image with alt containing "banner", else first image in document
	let firstImage: Image | undefined;
	let bannerImage: Image | undefined;
	walk(tree, (node) => {
		if (node.type === 'image') {
			const img = node as Image;
			if (!firstImage) firstImage = img;
			if (!bannerImage && /banner/i.test(img.alt ?? '')) bannerImage = img;
		}
	});
	const hero = (bannerImage ?? firstImage)?.url;
	if (hero) result.hero = hero;

	// tagline: first paragraph after H1
	const h1Idx = children.findIndex((n) => n.type === 'heading' && (n as Heading).depth === 1);
	if (h1Idx >= 0) {
		for (let i = h1Idx + 1; i < children.length; i++) {
			const n = children[i];
			if (n.type === 'paragraph') {
				const text = mdToString(n as Paragraph).trim();
				if (text) {
					result.tagline = text;
					break;
				}
			}
			if (n.type === 'heading') break;
		}
	}

	// features: heading matching pattern followed by list
	for (let i = 0; i < children.length; i++) {
		const n = children[i];
		if (n.type === 'heading') {
			const text = mdToString(n as Heading);
			if (FEATURE_HEADING.test(text)) {
				for (let j = i + 1; j < children.length; j++) {
					const next = children[j];
					if (next.type === 'list') {
						const list = next as List;
						result.features = list.children.map((li) => mdToString(li).trim()).filter(Boolean);
						break;
					}
					if (next.type === 'heading') break;
				}
				if (result.features.length > 0) break;
			}
		}
	}

	// demos: link nodes matching demo text/url
	walk(tree, (node) => {
		if (node.type === 'link') {
			const link = node as Link;
			const label = mdToString(link).trim();
			if (DEMO_TEXT.test(label) || DEMO_TEXT.test(link.url)) {
				if (!result.demos.some((d) => d.url === link.url)) {
					result.demos.push({ label: label || link.url, url: link.url });
				}
			}
		}
	});

	// install: first fenced code whose first line matches install pattern
	for (const n of children) {
		if (n.type === 'code') {
			const code = n as Code;
			const firstLine = (code.value ?? '').split('\n')[0]?.trim() ?? '';
			if (INSTALL_LINE.test(firstLine)) {
				result.install = code.value;
				break;
			}
		}
	}

	return result;
}

function walk(node: unknown, visit: (n: Content | Root) => void): void {
	if (!node || typeof node !== 'object') return;
	visit(node as Content | Root);
	const children = (node as { children?: unknown[] }).children;
	if (Array.isArray(children)) {
		for (const child of children) walk(child, visit);
	}
}
