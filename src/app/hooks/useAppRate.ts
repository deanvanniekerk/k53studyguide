import { getAppRate } from "@/services/appRate";

// needed because: https://github.com/pushandplay/cordova-plugin-apprate/issues/291
export const useAppRate = () => {
    const appRate = getAppRate();
    return appRate;
};
