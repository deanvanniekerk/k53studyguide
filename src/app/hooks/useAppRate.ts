// import { getAppRate } from "@/services/appRate";
import { AppRate } from '@awesome-cordova-plugins/app-rate';

// needed because: https://github.com/pushandplay/cordova-plugin-apprate/issues/291
export const useAppRate = () => {
  // const appRate = getAppRate();
  return AppRate;
};
