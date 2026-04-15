import { contentHash } from '@scripts/lib/hash.ts';

export interface FallbackArt {
	gradient: string;
	monogram: string;
	hue: number;
}

export function fallbackArtFor(slug: string): FallbackArt {
	const hash = contentHash(slug);
	const hue = parseInt(hash.slice(0, 2), 16) % 360;
	const monogram = (slug.replace(/[^a-zA-Z0-9]/g, '')[0] ?? '?').toUpperCase();
	const gradient = `linear-gradient(135deg, hsl(${hue} 65% 25%), hsl(${(hue + 40) % 360} 65% 15%))`;
	return { gradient, monogram, hue };
}
