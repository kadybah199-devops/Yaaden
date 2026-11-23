/* Génère les icônes Android (PNG) depuis le logo SVG de Yaaden.
   Utilise sharp (librsvg) : aucun fichier binaire à versionner.
   Usage : node scripts/generate-icons.js
   Sortie : assets/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ + premier plan adaptatif. */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const candidates = [
  path.join(root, '..', 'assets', 'icon.svg'), // projet dans le dépôt (android/)
  path.join(process.env.HOME || '', 'workspace', 'yaaden', 'assets', 'icon.svg'), // local
];
const svgPath = candidates.find(function (p) { return fs.existsSync(p); });
if (!svgPath) {
  console.error('Logo SVG introuvable :', candidates.join(' ou '));
  process.exit(1);
}

const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

async function main() {
  const base = await sharp(svgPath).resize(1024, 1024).png().toBuffer();
  for (const [density, size] of Object.entries(sizes)) {
    const dir = path.join(root, 'assets', 'mipmap-' + density);
    fs.mkdirSync(dir, { recursive: true });
    const png = await sharp(base).resize(size, size).png().toBuffer();
    fs.writeFileSync(path.join(dir, 'ic_launcher.png'), png);
    fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), png);
  }
  // Premier plan adaptatif : l'œuvre à 66 % centrée sur fond transparent (zone sûre).
  const art = await sharp(base).resize(288, 288).png().toBuffer();
  const fg = await sharp({
    create: { width: 432, height: 432, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: art, top: 72, left: 72 }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(root, 'assets', 'mipmap-xxxhdpi', 'ic_launcher_foreground.png'), fg);
  console.log('Icônes Android générées depuis', svgPath);
}

main().catch(function (e) { console.error(e); process.exit(1); });
