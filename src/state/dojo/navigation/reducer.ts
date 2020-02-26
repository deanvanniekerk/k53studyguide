import { NavigationActions } from "./";

export type NavigationState = {
    readonly targetNavigationKey: string | null;
};

export const defaultState: NavigationState = {
    targetNavigationKey: null,
};

export const reducer = (
    state: NavigationState = defaultState,
    action: NavigationActions
): NavigationState => {
    switch (action.type) {
        case "DOJO_NAV_RECIEVE_TARGET_NAVIGATION_KEY":
            return {
                ...state,
                targetNavigationKey: action.payload,
            };
        default:
            return state;
    }
};
