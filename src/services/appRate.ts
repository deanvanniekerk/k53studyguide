import { AppRateOriginal } from "@ionic-native/app-rate";

export const getAppRate = (): AppRateOriginal => {
    // @ts-ignore
    const appRate: AppRateOriginal = window["AppRate"];
    return appRate;
};
