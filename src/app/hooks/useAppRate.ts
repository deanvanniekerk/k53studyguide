import { getAppRate } from "@/services/appRate";

export const useAppRate = () => {
    const appRate = getAppRate();
    return appRate;
};
