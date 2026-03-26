// Generates all required PNG icons from an inline SVG using Sharp.
// Run: npm run icons

import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const SIZES = [16, 32, 48, 128] as const;
const OUT = resolve(process.cwd(), 'icons');

// Gradient SVG icon (matches popup logo)
const SVG = (size: number): Buffer => Buffer.from(`
<svg width="${size}" height="${size}" viewBox="0 0 128 128"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#4f6ef7"/>
      <stop offset="100%" stop-color="#34c77b"/>
    </linearGradient>
  </defs>
  <!-- Background rounded square -->
  <rect width="128" height="128" rx="28" fill="url(#g)"/>
  <!-- PiP icon (white) -->
  <rect x="12" y="24" width="104" height="72" rx="8"
        fill="none" stroke="white" stroke-width="9"/>
  <rect x="58" y="52" width="46" height="32" rx="4" fill="white"/>
</svg>
`);

mkdirSync(OUT, { recursive: true });

async function generate(): Promise<void> {
  for (const size of SIZES) {
    const outPath = resolve(OUT, `icon-${size}.png`);
    await sharp(SVG(size))
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✓ icon-${size}.png`);
  }
  console.log('\n✅ All icons generated in public/icons/');
}

generate().catch(console.error);