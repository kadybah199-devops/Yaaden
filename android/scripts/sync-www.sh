#!/usr/bin/env bash
# Copie l'application web Yaaden (racine du dépôt, ou ~/workspace/yaaden en local)
# vers www/ pour Capacitor. À relancer à chaque nouvelle version du site.
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$DIR/../index.html" ]; then
  SRC="$DIR/.."
elif [ -f "$HOME/workspace/yaaden/index.html" ]; then
  SRC="$HOME/workspace/yaaden"
else
  echo "Application web Yaaden introuvable." >&2
  exit 1
fi
rm -rf "$DIR/www"
mkdir -p "$DIR/www"
cp "$SRC/index.html" "$SRC/styles.css" "$SRC/app.js" "$SRC/manifest.json" "$SRC/sw.js" "$DIR/www/"
cp -r "$SRC/assets" "$DIR/www/"
echo "www/ synchronisé depuis $SRC"
