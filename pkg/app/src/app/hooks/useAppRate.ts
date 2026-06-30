import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { AppReview } from "@capawesome/capacitor-app-review";

const APPLE_APP_ID = "6784718443";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app";
const APP_STORE_URL = `https://apps.apple.com/app/id${APPLE_APP_ID}`;

type RequestReviewOptions = {
  fallbackToStore?: boolean;
};

const storeUrlForPlatform = () => (Capacitor.getPlatform() === "ios" ? APP_STORE_URL : PLAY_STORE_URL);

const openStoreListing = async () => {
  const platform = Capacitor.getPlatform();

  if (platform === "ios") {
    await AppReview.openAppStore({ appId: APPLE_APP_ID });
    return;
  }

  if (platform === "android") {
    await AppReview.openAppStore();
    return;
  }

  await Browser.open({ url: storeUrlForPlatform() });
};

const appRate = {
  async requestReview(options: RequestReviewOptions = {}) {
    const fallbackToStore = options.fallbackToStore ?? true;

    if (!Capacitor.isNativePlatform()) {
      if (fallbackToStore) {
        await openStoreListing();
      }
      return;
    }

    try {
      // The store may silently skip the dialog, so the fallback keeps manual taps useful.
      await AppReview.requestReview();
    } catch (error) {
      console.warn("App review request failed", error);
      if (fallbackToStore) {
        await openStoreListing();
      }
    }
  },
  navigateToAppStore() {
    void openStoreListing().catch((error) => {
      console.warn("App store listing failed", error);
      void Browser.open({ url: storeUrlForPlatform() });
    });
  },
};

export const useAppRate = () => appRate;
