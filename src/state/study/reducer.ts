import { combineReducers } from "redux";

import { ContentState, reducer as content } from "./content";
import { NavigationActions, NavigationState, reducer as navigation } from "./navigation";

export type StudyState = {
    content: ContentState;
    navigation: NavigationState;
};

export type StudyActions = NavigationActions;

export const reducer = combineReducers({
    content: content,
    navigation: navigation,
});
