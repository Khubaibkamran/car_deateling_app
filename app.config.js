const fs = require('fs');

// The Maps SDK needs an API key in the Android manifest. Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env
// (a key with "Maps SDK for Android" enabled); without it, the key already in google-services.json is tried.
function firebaseKey() {
  try {
    const file = JSON.parse(fs.readFileSync(`${__dirname}/google-services.json`, 'utf8'));
    return file.client?.[0]?.api_key?.[0]?.current_key;
  } catch {
    return undefined;
  }
}

module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: { apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || firebaseKey() },
    },
  },
});
