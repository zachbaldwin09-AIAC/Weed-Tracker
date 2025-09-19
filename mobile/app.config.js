export default {
  expo: {
    name: "Weed Tracker",
    slug: "weed-tracker",
    owner: "zachbaldwin09-aiac",
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
      bundleIdentifier: "com.zachbaldwin09-aiac.weedtracker",
      buildNumber: "1",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.zachbaldwin09-aiac.weedtracker",
      versionCode: 1
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "e875f9a0-497d-4b2c-b08e-c55002c660b8"
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