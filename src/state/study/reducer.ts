import { combineReducers } from "redux";

import { reducer as content } from "./content";
import { reducer as log } from "./log";
import { reducer as navigation } from "./navigation";

export const reducer = combineReducers({
    content: content,
    navigation: navigation,
    log: log,
});
