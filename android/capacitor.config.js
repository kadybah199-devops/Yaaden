/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.digifind.yaaden',
  appName: 'Yaaden',
  webDir: 'www',
  backgroundColor: '#0B1F33',
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: 'https',
  },
};

module.exports = config;
