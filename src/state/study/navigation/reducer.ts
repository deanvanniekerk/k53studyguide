import { NavigationData, navigationData, NavigationIcons, navigationIcons } from "@/data";

import { NavigationActions } from "./actions";

export type NavigationState = {
    readonly navigationData: NavigationData;
    readonly currentNavigationKey: string;
    readonly navigationIcons: NavigationIcons;
};

export const defaultState: NavigationState = {
    navigationData: navigationData,
    currentNavigationKey: "nav",
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
