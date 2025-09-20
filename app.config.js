// app.config.js
export default ({ config }) => {
  return {
    ...config,
    name: "Weed Tracker",
    slug: "weed-tracker",
    owner: "Zach Baldwin",
    ios: {
      bundleIdentifier: "com.zachbaldwin09-aiac.weedtracker",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
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