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
    },
  };
};