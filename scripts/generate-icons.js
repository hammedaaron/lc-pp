import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp, geometric, metallic silver-white FX monogram on pure black background
function getSvg(isMaskable = false) {
  // If maskable, scale the inner monogram down to ~72% so it fits safely inside the 80% circle
  const scale = isMaskable ? 0.72 : 0.88;
  const translate = isMaskable ? 71.68 : 30.72; // (512 * (1 - scale)) / 2

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background subtle gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0a0a0c" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Metallic Silver-White Primary Gradient -->
    <linearGradient id="silverBright" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="22%" stop-color="#F1F5F9" />
      <stop offset="48%" stop-color="#CBD5E1" />
      <stop offset="78%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <!-- Metallic Silver Secondary Gradient for Cross-strokes -->
    <linearGradient id="silverSheen" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="35%" stop-color="#94A3B8" />
      <stop offset="70%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <!-- Bevel highlight line -->
    <linearGradient id="silverEdge" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#E2E8F0" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#64748B" stop-opacity="0.3" />
    </linearGradient>

    <!-- Subtle glow filter -->
    <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Black Canvas -->
  <rect width="512" height="512" fill="url(#bgGrad)" />

  <!-- Monogram Group with safe scaling -->
  <g transform="translate(${translate}, ${translate}) scale(${scale})">
    <!-- Subtle Ambient Silver Glow under Monogram -->
    <g opacity="0.25" filter="url(#softGlow)">
      <!-- F Shadow -->
      <path d="M 96 128 L 236 128 L 222 174 L 148 174 L 148 234 L 210 234 L 198 276 L 148 276 L 148 384 L 96 384 Z" fill="#E2E8F0" />
      <!-- X Shadow -->
      <path d="M 252 128 L 302 128 L 350 232 L 398 128 L 448 128 L 376 270 L 452 384 L 400 384 L 350 298 L 298 384 L 246 384 L 324 256 Z" fill="#E2E8F0" />
    </g>

    <!-- Main 'F' Monogram -->
    <!-- Vertical stem + top bar + middle bar with precision aerodynamic cuts -->
    <path
      d="M 96 128
         L 238 128
         L 220 174
         L 150 174
         L 150 232
         L 214 232
         L 200 274
         L 150 274
         L 150 384
         L 96 384
         Z"
      fill="url(#silverBright)"
    />

    <!-- 'F' Top edge highlight -->
    <path
      d="M 96 128 L 238 128 L 232 134 L 102 134 Z"
      fill="#FFFFFF"
      opacity="0.9"
    />

    <!-- Main 'X' Monogram -->
    <!-- Backward stroke: top-right to bottom-left -->
    <path
      d="M 398 128
         L 448 128
         L 298 384
         L 248 384
         Z"
      fill="url(#silverSheen)"
    />

    <!-- Forward stroke: top-left to bottom-right with crisp bevel crossing -->
    <path
      d="M 252 128
         L 302 128
         L 350 228
         L 398 128
         L 448 128
         L 376 266
         L 452 384
         L 402 384
         L 350 294
         L 298 384
         L 248 384
         L 326 256
         Z"
      fill="url(#silverBright)"
    />

    <!-- Inner crossing highlight on X -->
    <path
      d="M 334 242 L 366 242 L 382 272 L 350 272 Z"
      fill="#FFFFFF"
      opacity="0.35"
    />

    <!-- Precision Subtitle / Geometric Accent Line -->
    <rect x="96" y="404" width="356" height="4" rx="2" fill="url(#silverBright)" opacity="0.8" />
    <circle cx="96" cy="406" r="3" fill="#FFFFFF" />
    <circle cx="452" cy="406" r="3" fill="#FFFFFF" />
  </g>
</svg>`;
}

// 1200x630 High-Resolution Social Cover Card for OpenGraph & Twitter
function getOgCoverSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="coverBg" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#141418" />
      <stop offset="55%" stop-color="#09090b" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Metallic Silver Gradients -->
    <linearGradient id="ogSilverBright" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="25%" stop-color="#F8FAFC" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="80%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <linearGradient id="ogSilverSheen" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F1F5F9" />
      <stop offset="40%" stop-color="#94A3B8" />
      <stop offset="70%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25" />
    </linearGradient>

    <!-- Card Glow -->
    <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Obsidian Background -->
  <rect width="1200" height="630" fill="url(#coverBg)" />

  <!-- Subtle Financial Grid Accent -->
  <g opacity="0.06" stroke="#FFFFFF" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Central Glass Card Frame -->
  <rect x="490" y="70" width="220" height="220" rx="44" fill="#0c0d10" stroke="url(#badgeBorder)" stroke-width="2" />
  <rect x="492" y="72" width="216" height="216" rx="42" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1" />

  <!-- Monogram embedded inside the card -->
  <g transform="translate(480, 60) scale(0.47)" filter="url(#logoGlow)">
    <!-- F -->
    <path
      d="M 96 128 L 238 128 L 220 174 L 150 174 L 150 232 L 214 232 L 200 274 L 150 274 L 150 384 L 96 384 Z"
      fill="url(#ogSilverBright)"
    />
    <path d="M 96 128 L 238 128 L 232 134 L 102 134 Z" fill="#FFFFFF" opacity="0.9" />

    <!-- X -->
    <path d="M 398 128 L 448 128 L 298 384 L 248 384 Z" fill="url(#ogSilverSheen)" />
    <path
      d="M 252 128 L 302 128 L 350 228 L 398 128 L 448 128 L 376 266 L 452 384 L 402 384 L 350 294 L 298 384 L 248 384 L 326 256 Z"
      fill="url(#ogSilverBright)"
    />

    <!-- Accent bar -->
    <rect x="96" y="404" width="356" height="4" rx="2" fill="url(#ogSilverBright)" opacity="0.8" />
  </g>

  <!-- Typography: App Name -->
  <text x="600" y="360" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif" font-size="44" font-weight="700" fill="#FFFFFF" letter-spacing="1.5">
    FX POSITION PLANNER
  </text>

  <!-- Subtitle -->
  <text x="600" y="405" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" fill="#94A3B8" letter-spacing="0.5">
    Crypto Stop-Loss Distance Reference &amp; Position Sizing Matrix
  </text>

  <!-- Feature Badges -->
  <g transform="translate(600, 480)">
    <!-- Badge 1: 3-Column Matrix -->
    <g transform="translate(-240, 0)">
      <rect x="-90" y="-18" width="180" height="36" rx="18" fill="#18181b" stroke="#27272a" stroke-width="1" />
      <text x="0" y="5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#E2E8F0" letter-spacing="0.5">
        SL DISTANCE • QTY • MARGIN
      </text>
    </g>

    <!-- Badge 2: TradingView Ready -->
    <g transform="translate(0, 0)">
      <rect x="-95" y="-18" width="190" height="36" rx="18" fill="#18181b" stroke="#27272a" stroke-width="1" />
      <text x="0" y="5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#00D26A" letter-spacing="0.5">
        TRADINGVIEW COMPATIBLE
      </text>
    </g>

    <!-- Badge 3: PWA Offline -->
    <g transform="translate(240, 0)">
      <rect x="-85" y="-18" width="170" height="36" rx="18" fill="#18181b" stroke="#27272a" stroke-width="1" />
      <text x="0" y="5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#38BDF8" letter-spacing="0.5">
        OFFLINE-FIRST PWA
      </text>
    </g>
  </g>

  <!-- Bottom Brandmark -->
  <text x="600" y="585" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#52525B" letter-spacing="1">
    INSTANT QUANTITY &amp; LEVERAGE LOOKUP ACROSS ALL DEVICES
  </text>
</svg>`;
}

async function run() {
  const standardSvg = getSvg(false);
  const maskableSvg = getSvg(true);
  const ogCoverSvg = getOgCoverSvg();

  // Write SVG files
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), maskableSvg, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'og-cover.svg'), ogCoverSvg, 'utf-8');

  // Generate PNGs using sharp
  const standardBuffer = Buffer.from(standardSvg);
  const maskableBuffer = Buffer.from(maskableSvg);
  const ogCoverBuffer = Buffer.from(ogCoverSvg);

  // Social Cover Card (1200x630) for og:image, twitter:image, chat previews
  await sharp(ogCoverBuffer)
    .resize(1200, 630)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'og-cover.png'));

  // Standard PWA Icons for Android & Desktop
  await sharp(standardBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  await sharp(standardBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // Maskable PWA Icon for Android launcher (prevents circular / squircle cropping borders)
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Apple Touch Icons for iOS & iPadOS
  await sharp(standardBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(standardBuffer)
    .resize(167, 167)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon-167x167.png'));

  await sharp(standardBuffer)
    .resize(152, 152)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon-152x152.png'));

  // Favicons
  await sharp(standardBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  await sharp(standardBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(standardBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // Windows / Legacy Favicon.ico (generate 32x32 PNG as favicon.ico)
  await sharp(standardBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All FX logo, PWA icons, Apple Touch icons, favicons, and OG cover generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
