import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp, geometric, metallic silver-white CSL (Crypto SL) monogram on pure black background
function getSvg(isMaskable = false) {
  // If maskable, scale the inner monogram down to ~72% so it fits safely inside the 80% circle
  const scale = isMaskable ? 0.70 : 0.86;
  const translate = isMaskable ? 76.8 : 35.84; // (512 * (1 - scale)) / 2

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background subtle gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0e0e12" />
      <stop offset="60%" stop-color="#050507" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Metallic Silver-White Primary Gradient -->
    <linearGradient id="silverBright" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="20%" stop-color="#F1F5F9" />
      <stop offset="45%" stop-color="#CBD5E1" />
      <stop offset="75%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <!-- Metallic Silver Secondary Gradient for S & Sheen -->
    <linearGradient id="silverSheen" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="35%" stop-color="#94A3B8" />
      <stop offset="70%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <!-- Highlight gradient for bevels -->
    <linearGradient id="silverGleam" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.3" />
    </linearGradient>

    <!-- Subtle glow filter -->
    <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Black Canvas -->
  <rect width="512" height="512" fill="url(#bgGrad)" />

  <!-- Subtle ambient corner brackets -->
  <g stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.5" fill="none">
    <path d="M 40 60 L 40 40 L 60 40" />
    <path d="M 472 60 L 472 40 L 452 40" />
    <path d="M 40 452 L 40 472 L 60 472" />
    <path d="M 472 452 L 472 472 L 452 472" />
  </g>

  <!-- Monogram Group with safe scaling -->
  <g transform="translate(${translate}, ${translate}) scale(${scale})">
    <!-- Ambient Silver Glow under Monogram -->
    <g opacity="0.22" filter="url(#softGlow)">
      <!-- C glow -->
      <path d="M 181 130 L 115 130 L 81 164 L 81 336 L 115 370 L 181 370 L 171 326 L 135 326 L 125 316 L 125 184 L 135 174 L 171 174 Z" fill="#FFFFFF" />
      <!-- S glow -->
      <path d="M 216 130 L 296 130 L 306 140 L 306 210 L 296 220 L 236 238 L 230 246 L 230 290 L 240 300 L 296 300 L 306 310 L 306 356 L 292 370 L 216 370 L 206 360 L 206 290 L 216 280 L 276 262 L 282 254 L 282 210 L 272 200 L 216 200 L 206 190 L 206 144 Z" fill="#FFFFFF" />
      <!-- L glow -->
      <path d="M 331 130 L 375 130 L 375 326 L 431 326 L 421 370 L 345 370 L 331 356 Z" fill="#FFFFFF" />
    </g>

    <!-- Top Branding Mini-Tag: CRYPTO SL -->
    <g opacity="0.8">
      <rect x="156" y="78" width="200" height="24" rx="12" fill="#18181c" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1" />
      <text x="256" y="94" text-anchor="middle" font-family="'JetBrains Mono', -apple-system, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0" letter-spacing="3">
        CRYPTO SL
      </text>
    </g>

    <!-- Letter 'C' (Crypto) -->
    <path
      d="M 181 130
         L 115 130
         L 81 164
         L 81 336
         L 115 370
         L 181 370
         L 171 326
         L 135 326
         L 125 316
         L 125 184
         L 135 174
         L 171 174
         Z"
      fill="url(#silverBright)"
    />
    <!-- C top bevel highlight -->
    <path d="M 181 130 L 115 130 L 81 164 L 92 164 L 122 138 L 181 138 Z" fill="#FFFFFF" opacity="0.9" />

    <!-- Letter 'S' (Stop) -->
    <path
      d="M 216 130
         L 296 130
         L 306 140
         L 306 208
         L 296 218
         L 238 236
         L 230 244
         L 230 290
         L 240 300
         L 296 300
         L 306 310
         L 306 356
         L 292 370
         L 216 370
         L 206 360
         L 206 292
         L 216 282
         L 274 264
         L 282 256
         L 282 210
         L 272 200
         L 216 200
         L 206 190
         L 206 144
         Z"
      fill="url(#silverSheen)"
    />
    <!-- S highlight top cut -->
    <path d="M 216 130 L 296 130 L 306 140 L 300 144 L 292 136 L 216 136 Z" fill="#FFFFFF" opacity="0.9" />

    <!-- Letter 'L' (Loss) -->
    <path
      d="M 331 130
         L 375 130
         L 375 326
         L 431 326
         L 421 370
         L 345 370
         L 331 356
         Z"
      fill="url(#silverBright)"
    />
    <!-- L top & corner highlights -->
    <path d="M 331 130 L 375 130 L 370 136 L 336 136 Z" fill="#FFFFFF" opacity="0.9" />

    <!-- Precision Base Metric Ruler / Coordinate Line -->
    <rect x="81" y="400" width="350" height="5" rx="2.5" fill="url(#silverBright)" opacity="0.9" />
    <!-- Ticks & Endpoints -->
    <polygon points="81,402.5 75,397 75,408" fill="#FFFFFF" />
    <polygon points="431,402.5 437,397 437,408" fill="#FFFFFF" />
    <circle cx="256" cy="402.5" r="3" fill="#FFFFFF" />
  </g>
</svg>`;
}

// 1200x630 High-Resolution Social Cover Card for Crypto SL
function getOgCoverSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="coverBg" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#141418" />
      <stop offset="55%" stop-color="#08080a" />
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
      <feGaussianBlur stdDeviation="20" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Deep Obsidian Background -->
  <rect width="1200" height="630" fill="url(#coverBg)" />

  <!-- Subtle Financial Coordinate Grid Accent -->
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
  <rect x="475" y="65" width="250" height="230" rx="44" fill="#0b0b0e" stroke="url(#badgeBorder)" stroke-width="2" />
  <rect x="477" y="67" width="246" height="226" rx="42" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1" />

  <!-- Monogram embedded inside the card -->
  <g transform="translate(465, 48) scale(0.53)" filter="url(#logoGlow)">
    <!-- Top badge in monogram -->
    <rect x="156" y="78" width="200" height="24" rx="12" fill="#18181c" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1" />
    <text x="256" y="94" text-anchor="middle" font-family="'JetBrains Mono', sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" letter-spacing="3">
      CRYPTO SL
    </text>

    <!-- C -->
    <path d="M 181 130 L 115 130 L 81 164 L 81 336 L 115 370 L 181 370 L 171 326 L 135 326 L 125 316 L 125 184 L 135 174 L 171 174 Z" fill="url(#ogSilverBright)" />
    <!-- S -->
    <path d="M 216 130 L 296 130 L 306 140 L 306 208 L 296 218 L 238 236 L 230 244 L 230 290 L 240 300 L 296 300 L 306 310 L 306 356 L 292 370 L 216 370 L 206 360 L 206 292 L 216 282 L 274 264 L 282 256 L 282 210 L 272 200 L 216 200 L 206 190 L 206 144 Z" fill="url(#ogSilverSheen)" />
    <!-- L -->
    <path d="M 331 130 L 375 130 L 375 326 L 431 326 L 421 370 L 345 370 L 331 356 Z" fill="url(#ogSilverBright)" />

    <!-- Ruler -->
    <rect x="81" y="400" width="350" height="5" rx="2.5" fill="url(#ogSilverBright)" />
  </g>

  <!-- Typography: App Name -->
  <text x="600" y="360" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif" font-size="46" font-weight="800" fill="#FFFFFF" letter-spacing="2">
    CRYPTO SL
  </text>

  <!-- Subtitle -->
  <text x="600" y="405" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" fill="#94A3B8" letter-spacing="0.5">
    Stop-Loss Distance Reference &amp; Position Sizing Matrix
  </text>

  <!-- Feature Badges -->
  <g transform="translate(600, 480)">
    <!-- Badge 1: 3-Column Matrix -->
    <g transform="translate(-240, 0)">
      <rect x="-95" y="-18" width="190" height="36" rx="18" fill="#18181b" stroke="#27272a" stroke-width="1" />
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

  console.log('All Crypto SL logo, PWA icons, Apple Touch icons, favicons, and OG cover generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
