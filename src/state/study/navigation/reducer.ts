import { NavigationData, navigationData } from "@/data";

import { NavigationActions } from "./actions";

export type NavigationState = {
    readonly navigationData: NavigationData;
    readonly currentNavigationKey: string;
};

export const defaultState: NavigationState = {
    navigationData: navigationData,
    currentNavigationKey: "nav",
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
    return state;
};
