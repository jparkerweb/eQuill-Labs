import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString as mdToString } from 'mdast-util-to-string';
import type { Root, Content, Image, Link, Heading, List, Paragraph } from 'mdast';

export type ReadmeExtract = {
	hero?: string;
	tagline?: string;
	features: string[];
	demos: Array<{ label: string; url: string }>;
	/** Full `## Installation` section, verbatim from the README, heading normalized to H2. */
	installSection?: string;
};

const FEATURE_HEADING = /features|why|highlights/i;
const DEMO_TEXT = /demo|live|playground|try it/i;
// Genuine install headings only — "Installation", "Install", "Setup",
// "Getting Started", and the common "… & Setup / Guide / Steps / Instructions"
// variants. Deliberately excludes incidental matches like "Install Note" so the
// page only surfaces a real `## Installation` block.
const INSTALL_HEADING =
	/^(installation|install|installing|setup|getting started)(\s*&\s*setup|\s+guide|\s+steps|\s+instructions)?$/i;

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

	// hero: first image with alt containing "banner", else first image in document.
	// Matches both markdown images (![alt](url)) and raw HTML <img> tags.
	type ImgRef = { url: string; alt: string };
	let firstImage: ImgRef | undefined;
	let bannerImage: ImgRef | undefined;
	const consider = (ref: ImgRef) => {
		if (!firstImage) firstImage = ref;
		if (!bannerImage && /banner/i.test(ref.alt)) bannerImage = ref;
	};
	walk(tree, (node) => {
		if (node.type === 'image') {
			const img = node as Image;
			consider({ url: img.url, alt: img.alt ?? '' });
		} else if (node.type === 'html') {
			const html = (node as { value?: string }).value ?? '';
			const imgTagRe = /<img\b[^>]*>/gi;
			for (const match of html.matchAll(imgTagRe)) {
				const tag = match[0];
				const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
				if (!src) continue;
				const alt = /\balt\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1] ?? '';
				consider({ url: src, alt });
			}
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

	// demos: HTML <a data-tag="demo"> takes priority (explicit marker authored by repo owner),
	// followed by markdown links whose label or URL matches demo-ish text.
	//
	// Scan the raw markdown rather than AST html nodes: remark splits *inline* HTML
	// (e.g. an <a> inside a heading) into separate open-tag/content/close-tag nodes, so
	// the full <a>…</a> never appears in a single node value. The source string always
	// keeps it contiguous, which catches both inline and block-level anchors.
	const taggedDemos: Array<{ label: string; url: string }> = [];
	const anchorRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
	for (const match of markdown.matchAll(anchorRe)) {
		const attrs = match[1] ?? '';
		const inner = match[2] ?? '';
		const dataTag = /\bdata-tag\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
		if (!dataTag || dataTag.toLowerCase() !== 'demo') continue;
		const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
		if (!href) continue;
		const label = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || href;
		if (!taggedDemos.some((d) => d.url === href)) {
			taggedDemos.push({ label, url: href });
		}
	}
	for (const d of taggedDemos) result.demos.push(d);

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

	// installation: the full "## Installation" section — from the install heading
	// through the next heading of the same or higher level — captured verbatim from
	// the source markdown so the page shows the repo's own install instructions.
	// The leading heading is normalized to H2 for consistency on the project page;
	// the body (code fences and all) is copied byte-for-byte, never AI-rewritten.
	for (let i = 0; i < children.length; i++) {
		const n = children[i];
		if (n.type !== 'heading') continue;
		const heading = n as Heading;
		const text = mdToString(heading).trim();
		if (!INSTALL_HEADING.test(text)) continue;

		const startOffset = heading.position?.end?.offset;
		if (startOffset == null) break;

		let endOffset = markdown.length;
		for (let j = i + 1; j < children.length; j++) {
			const next = children[j];
			if (next.type === 'heading' && (next as Heading).depth <= heading.depth) {
				endOffset = (next as Heading).position?.start?.offset ?? endOffset;
				break;
			}
		}

		const body = markdown.slice(startOffset, endOffset).trim();
		result.installSection = body ? `## ${text}\n\n${body}` : `## ${text}`;
		break;
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
