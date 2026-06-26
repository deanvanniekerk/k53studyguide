import { Browser } from "@capacitor/browser";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app";

export const useAppRate = () => {
  return {
    navigateToAppStore() {
      void Browser.open({ url: PLAY_STORE_URL });
    },
  };
};
