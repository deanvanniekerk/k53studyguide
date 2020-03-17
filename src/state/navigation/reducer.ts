import { NavigationData, navigationData } from "@/data";

export const ROOT_NAVIGATION_KEY = "nav";

export type NavigationState = {
    readonly navigationData: NavigationData;
};

export const defaultState: NavigationState = {
    navigationData: navigationData,
};

export const reducer = (state: NavigationState = defaultState): NavigationState => {
    return state;
};
