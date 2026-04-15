import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
	type: 'content',
	schema: z.object({
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
	}),
});

const pages = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		layout: z.enum(['default', 'about', 'project', 'prose']).default('default'),
		order: z.number().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { projects, pages };
