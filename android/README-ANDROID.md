# Yaaden — application Android

Ce dossier contient le projet **Capacitor** qui transforme le site web Yaaden
(à la racine du dépôt) en application Android installable (APK).

## Principe

- Le code de l'application reste le site web : `index.html`, `app.js`,
  `styles.css`, `manifest.json`, `sw.js` et `assets/` à la racine du dépôt.
- `scripts/sync-www.sh` copie ces fichiers vers `www/`.
- `scripts/generate-icons.js` génère les icônes PNG Android depuis
  `assets/icon.svg` (aucun fichier binaire versionné).
- `npx cap add android` crée le projet Android natif, puis
  `scripts/customize-android.js` applique les icônes, les couleurs nuit et
  la permission de localisation (bouton « Voitures près de moi »).
- `./gradlew assembleDebug` compile l'APK de test.

Identité de l'application : `com.digifind.yaaden`, nom « Yaaden »,
version alignée sur le site web (voir `package.json`).

## Compilation automatique (recommandé)

À chaque push sur `main` qui touche le site ou ce dossier, GitHub Actions
compile l'APK et le publie dans la release `android-vX.Y.Z` du dépôt
(voir `.github/workflows/android.yml`). L'APK se télécharge depuis la page
Releases de GitHub, puis se partage par WhatsApp.

## Compilation en local

Prérequis : Node 20+, JDK 17, SDK Android (API 35 + build-tools 35.0.0).

```bash
npm install
bash scripts/build-apk.sh
# APK : android/app/build/outputs/apk/debug/app-debug.apk
```

## Publier sur Google Play (plus tard)

L'APK de test est signée avec une clé de debug : elle s'installe en direct
mais ne peut pas aller sur le Play Store. Pour le Store, il faudra :

1. un compte développeur Google Play (25 $US, une fois) ;
2. une clé de signature release (keystore) et un build `assembleRelease`
   ou un bundle `.aab` (`bundleRelease`).
