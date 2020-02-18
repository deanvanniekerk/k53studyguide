import { NavigationData, navigationData, NavigationIcons, navigationIcons } from "src/data";

import { NavigationActions, ROOT_NAVIGATION_KEY } from "./";

export type NavigationState = {
    readonly navigationData: NavigationData;
    readonly currentNavigationKey: string;
    readonly navigationIcons: NavigationIcons;
};

export const defaultState: NavigationState = {
    navigationData: navigationData,
    currentNavigationKey: ROOT_NAVIGATION_KEY,
    navigationIcons: navigationIcons,
};

export const reducer = (
    state: NavigationState = defaultState,
    action: NavigationActions
): NavigationState => {
    switch (action.type) {
        case "STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY":
            return {
                ...state,
                currentNavigationKey: action.payload,
            };
        default:
            return state;
    }
};
