import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "deanvniekerk.k53studyguide.app",
  appName: "K53 Study Guide",
  webDir: "build",
  experimental: {
    ios: {
      spm: {
        swiftToolsVersion: "6.1",
        packageTraits: { "@capacitor-firebase/analytics": ["Analytics"] },
      },
    },
  },
};

export default config;
