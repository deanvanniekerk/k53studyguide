import { ContentData, contentData, NavigationData, navigationData } from "@/data";

import { ContentActions } from "./actions";

export type ContentState = {
    readonly contentData: ContentData;
    readonly navigationData: NavigationData;
    readonly currentNavigationKey: string;
};

export const defaultState: ContentState = {
    contentData: contentData,
    navigationData: navigationData,
    currentNavigationKey: "nav",
};

export const reducer = (
    state: ContentState = defaultState,
    action: ContentActions
): ContentState => {
    switch (action.type) {
        case "CONTENT_RECIEVE_CURRENT_NAVIGATION_KEY":
            return {
                ...state,
            };
        default:
            return state;
    }
    return state;
};
