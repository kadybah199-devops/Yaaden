/* Applique les personnalisations Yaaden au projet Android généré par Capacitor :
   icônes (classiques + adaptative), couleurs nuit, permission de localisation.
   Usage : node scripts/customize-android.js (après `npx cap add android`). */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const res = path.join(root, 'android', 'app', 'src', 'main', 'res');
const assets = path.join(root, 'assets');
if (!fs.existsSync(res)) {
  console.error('Projet Android introuvable. Lancez d\u2019abord : npx cap add android');
  process.exit(1);
}

// 1. Icônes par densité (classiques + rondes) et premier plan adaptatif.
['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'].forEach(function (d) {
  const src = path.join(assets, 'mipmap-' + d);
  const dst = path.join(res, 'mipmap-' + d);
  fs.mkdirSync(dst, { recursive: true });
  ['ic_launcher.png', 'ic_launcher_round.png'].forEach(function (f) {
    fs.copyFileSync(path.join(src, f), path.join(dst, f));
  });
});
fs.copyFileSync(
  path.join(assets, 'mipmap-xxxhdpi', 'ic_launcher_foreground.png'),
  path.join(res, 'mipmap-xxxhdpi', 'ic_launcher_foreground.png')
);

// 2. Icône adaptative (Android 8+) : fond bleu nuit + premier plan.
const anydpi = path.join(res, 'mipmap-anydpi-v26');
fs.mkdirSync(anydpi, { recursive: true });
const adaptive = '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n' +
  '    <background android:drawable="@color/ic_launcher_background"/>\n' +
  '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n' +
  '</adaptive-icon>\n';
fs.writeFileSync(path.join(anydpi, 'ic_launcher.xml'), adaptive);
fs.writeFileSync(path.join(anydpi, 'ic_launcher_round.xml'), adaptive);

// 3. Couleurs : fond bleu nuit, accent menthe.
const values = path.join(res, 'values');
fs.mkdirSync(values, { recursive: true });
fs.writeFileSync(path.join(values, 'ic_launcher_background.xml'),
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<resources><color name="ic_launcher_background">#0B1F33</color></resources>\n');
const colorsPath = path.join(values, 'colors.xml');
if (fs.existsSync(colorsPath)) {
  let colors = fs.readFileSync(colorsPath, 'utf-8');
  colors = colors
    .replace(/<color name="colorPrimary">[^<]*<\/color>/, '<color name="colorPrimary">#0B1F33</color>')
    .replace(/<color name="colorPrimaryDark">[^<]*<\/color>/, '<color name="colorPrimaryDark">#050F1A</color>')
    .replace(/<color name="colorAccent">[^<]*<\/color>/, '<color name="colorAccent">#3DDC97</color>');
  fs.writeFileSync(colorsPath, colors);
}

// 4. Permissions de localisation (bouton « Voitures près de moi »).
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
let manifest = fs.readFileSync(manifestPath, 'utf-8');
if (!manifest.includes('ACCESS_FINE_LOCATION')) {
  manifest = manifest.replace('</manifest>',
    '    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />\n' +
    '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n' +
    '    <uses-feature android:name="android.hardware.location.gps" android:required="false" />\n' +
    '</manifest>');
  fs.writeFileSync(manifestPath, manifest);
}

console.log('Personnalisations Android appliquées (icônes, couleurs, localisation).');
