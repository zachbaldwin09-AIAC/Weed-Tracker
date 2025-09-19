export default {
  expo: {
    name: "Weed Tracker",
    slug: "weed-tracker-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.zachbaldwin.weedtracker",
      buildNumber: "1"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.zachbaldwin.weedtracker",
      versionCode: 1
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || "your-project-id-here"
      }
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            keystorePath: process.env.ANDROID_KEYSTORE_PATH,
            keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
            keyAlias: process.env.ANDROID_KEY_ALIAS || "keyalias",
            keyPassword: process.env.ANDROID_KEY_PASSWORD
          },
          ios: {
            provisioningProfilePath: process.env.IOS_PROVISIONING_PROFILE_PATH,
            distributionCertificatePath: process.env.IOS_DIST_CERT_PATH,
            distributionCertificatePassword: process.env.IOS_DIST_CERT_PASSWORD
          }
        }
      ]
    ]
  }
};