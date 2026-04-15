import type { APIRoute } from 'astro';
import { renderOG } from '@/lib/og';

export const GET: APIRoute = async () => {
  const png = await renderOG({
    title: 'eQuill Labs',
    tagline: 'Building tools to enrich our digital lives',
  });
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
