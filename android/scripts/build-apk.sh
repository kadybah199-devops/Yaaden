#!/usr/bin/env bash
# Construit l'APK de test (debug) de Yaaden.
# Prérequis : JDK 17 (JAVA_HOME) et SDK Android (ANDROID_HOME).
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
bash "$DIR/scripts/sync-www.sh"
cd "$DIR"
[ -d android ] || { npx cap add android; node scripts/customize-android.js; }
npx cap sync android
cd android
./gradlew assembleDebug --no-daemon
APK="$DIR/android/app/build/outputs/apk/debug/app-debug.apk"
echo "APK : $APK ($(du -h "$APK" | cut -f1))"
