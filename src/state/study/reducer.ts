import { combineReducers } from "redux";

import { ContentState, reducer as content } from "./content";
import { LogActions, LogState, reducer as log } from "./log";
import { NavigationActions, NavigationState, reducer as navigation } from "./navigation";

export type StudyState = {
    content: ContentState;
    navigation: NavigationState;
    log: LogState;
};

export type StudyActions = NavigationActions | LogActions;

export const reducer = combineReducers({
    content: content,
    navigation: navigation,
    log: log,
});
