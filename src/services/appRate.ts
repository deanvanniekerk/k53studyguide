import type { AppRateOriginal } from "@awesome-cordova-plugins/app-rate";

export const getAppRate = (): AppRateOriginal => {
  const appRate: AppRateOriginal = window.AppRate;
  return appRate;
};
