import { AppRateOriginal } from '@awesome-cordova-plugins/app-rate';

export const getAppRate = (): AppRateOriginal => {
  // @ts-ignore
  const appRate: AppRateOriginal = window['AppRate'];
  return appRate;
};
