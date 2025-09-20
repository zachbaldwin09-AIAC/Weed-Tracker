// app.config.js
export default ({ config }) => {
  return {
    ...config,
    name: "Weed Tracker",
    slug: "weed-tracker",
    owner: "zachbaldwin09-aiac",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.zachbaldwin09-aiac.weedtracker",
      buildNumber: "1",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.zachbaldwin09-aiac.weedtracker",
      versionCode: 1
    },
    extra: {
      eas: {
        projectId: "e875f9a0-497d-4b2c-b08e-c55002c660b8",
      },
      apiBaseUrl: process.env.NODE_ENV === 'development' 
        ? 'http://192.168.1.100:5000' // Replace with your local IP or tunnel URL
        : 'https://your-production-api.com',
    },
  };
};