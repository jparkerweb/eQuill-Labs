import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..');

const GEIST_400 = path.join(
  REPO_ROOT,
  'node_modules',
  '@fontsource',
  'geist-sans',
  'files',
  'geist-sans-latin-400-normal.woff',
);
const GEIST_500 = path.join(
  REPO_ROOT,
  'node_modules',
  '@fontsource',
  'geist-sans',
  'files',
  'geist-sans-latin-500-normal.woff',
);
const INSTRUMENT_SERIF = path.join(
  REPO_ROOT,
  'node_modules',
  '@fontsource',
  'instrument-serif',
  'files',
  'instrument-serif-latin-400-italic.woff',
);

type FontWeight = 400 | 500;

let cachedFonts: Array<{
  name: string;
  data: Buffer;
  weight: FontWeight;
  style: 'normal' | 'italic';
}> | null = null;

function loadFonts() {
  if (cachedFonts) return cachedFonts;
  cachedFonts = [
    { name: 'Geist', data: fs.readFileSync(GEIST_400), weight: 400, style: 'normal' },
    { name: 'Geist', data: fs.readFileSync(GEIST_500), weight: 500, style: 'normal' },
    {
      name: 'Instrument Serif',
      data: fs.readFileSync(INSTRUMENT_SERIF),
      weight: 400,
      style: 'italic',
    },
  ];
  return cachedFonts;
}

export interface OGInput {
  title: string;
  tagline?: string;
  eyebrow?: string;
}

const BG = '#0C0E14';
const TEXT_1 = '#E8ECF4';
const TEXT_2 = '#B8C0CE';
const TEXT_MUTED = '#7A8499';
const GRAD_1 = '#00D4FF';
const GRAD_2 = '#5B4FE6';
const GRAD_3 = '#090979';

function buildTree({ title, tagline, eyebrow }: OGInput) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px',
        background: BG,
        color: TEXT_1,
        fontFamily: 'Geist',
        position: 'relative',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
              fontSize: '36px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
            },
            children: [
              { type: 'span', props: { children: 'eQui' } },
              {
                type: 'span',
                props: {
                  style: {
                    fontWeight: 700,
                    backgroundImage: `linear-gradient(90deg, ${GRAD_1} 0%, ${GRAD_2} 50%, ${GRAD_3} 100%)`,
                    backgroundClip: 'text',
                    color: 'transparent',
                  },
                  children: '\\\\',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Instrument Serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    marginLeft: '6px',
                  },
                  children: 'Labs',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '20px' },
            children: [
              eyebrow
                ? {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '20px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: TEXT_MUTED,
                      },
                      children: eyebrow,
                    },
                  }
                : null,
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: title.length > 40 ? '72px' : '96px',
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: TEXT_1,
                    display: 'flex',
                  },
                  children: title,
                },
              },
              tagline
                ? {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'Instrument Serif',
                        fontStyle: 'italic',
                        fontSize: '36px',
                        lineHeight: 1.25,
                        color: TEXT_2,
                        display: 'flex',
                      },
                      children: tagline,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '20px',
              color: TEXT_MUTED,
            },
            children: [
              { type: 'span', props: { children: 'equilllabs.com' } },
              {
                type: 'span',
                props: {
                  style: {
                    fontWeight: 700,
                    fontSize: '40px',
                    backgroundImage: `linear-gradient(90deg, ${GRAD_1} 0%, ${GRAD_2} 50%, ${GRAD_3} 100%)`,
                    backgroundClip: 'text',
                    color: 'transparent',
                  },
                  children: '\\\\',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export async function renderOG(input: OGInput): Promise<Buffer> {
  const fonts = loadFonts();
  const svg = await satori(buildTree(input) as any, {
    width: 1200,
    height: 630,
    fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return Buffer.from(png);
}
