import { NavigationData, navigationData, NavigationIcons, navigationIcons } from "@/data";

export const ROOT_NAVIGATION_KEY = "nav";

export type NavigationState = {
    readonly navigationData: NavigationData;
    readonly navigationIcons: NavigationIcons;
};

export const defaultState: NavigationState = {
    navigationData: navigationData,
    navigationIcons: navigationIcons,
};

export const reducer = (state: NavigationState = defaultState): NavigationState => {
    return state;
};
