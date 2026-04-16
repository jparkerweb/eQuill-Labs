import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOG } from '@/lib/og';

interface Params extends Record<string, string | undefined> {
  slug: string;
}

interface Props extends Record<string, unknown> {
  title: string;
  tagline?: string;
  eyebrow?: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects');
  const projectPaths = projects
    .filter((p) => p.data.status !== 'hidden')
    .map((p) => ({
      params: { slug: p.id },
      props: {
        title: p.data.name,
        tagline: p.data.tagline ?? p.data.description.short ?? '',
        eyebrow: 'Project',
      } satisfies Props,
    }));

  const topLevelPaths: Array<{ params: Params; props: Props }> = [
    {
      params: { slug: 'home' },
      props: {
        title: 'eQuill Labs',
        tagline: 'Building tools to enrich our digital lives',
      },
    },
    {
      params: { slug: 'projects' },
      props: {
        title: 'Projects',
        tagline: 'Open-source AI engineering by Justin Parker',
        eyebrow: 'Catalog',
      },
    },
    {
      params: { slug: 'about' },
      props: {
        title: 'About Justin',
        tagline: 'AI engineer — building tools for digital lives',
        eyebrow: 'About',
      },
    },
    {
      params: { slug: '404' },
      props: {
        title: 'Page not found',
        tagline: 'The page you requested doesn\u2019t exist.',
      },
    },
  ];

  return [...topLevelPaths, ...projectPaths];
};

export const GET: APIRoute<Props, Params> = async ({ props }) => {
  const png = await renderOG({
    title: props.title,
    tagline: props.tagline,
    eyebrow: props.eyebrow,
  });
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
