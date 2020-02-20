import { NavigationActions } from "./";

export const ROOT_NAVIGATION_KEY = "nav";

export type NavigationState = {
    readonly currentNavigationKey: string;
};

export const defaultState: NavigationState = {
    currentNavigationKey: ROOT_NAVIGATION_KEY,
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
