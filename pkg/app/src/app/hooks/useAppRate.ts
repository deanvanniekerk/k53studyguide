import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { AppReview } from "@capawesome/capacitor-app-review";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app";

type RequestReviewOptions = {
  fallbackToStore?: boolean;
};

const openPlayStoreListing = async () => {
  if (Capacitor.getPlatform() === "android") {
    await AppReview.openAppStore();
    return;
  }

  await Browser.open({ url: PLAY_STORE_URL });
};

const appRate = {
  async requestReview(options: RequestReviewOptions = {}) {
    const fallbackToStore = options.fallbackToStore ?? true;

    if (!Capacitor.isNativePlatform()) {
      if (fallbackToStore) {
        await openPlayStoreListing();
      }
      return;
    }

    try {
      // Google may silently skip the dialog, so the fallback keeps manual taps useful.
      await AppReview.requestReview();
    } catch (error) {
      console.warn("App review request failed", error);
      if (fallbackToStore) {
        await openPlayStoreListing();
      }
    }
  },
  navigateToAppStore() {
    void openPlayStoreListing().catch((error) => {
      console.warn("App store listing failed", error);
      void Browser.open({ url: PLAY_STORE_URL });
    });
  },
};

export const useAppRate = () => appRate;
