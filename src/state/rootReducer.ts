import { combineReducers } from "redux";

import { reducer as content } from "./content";
import { reducer as dojo } from "./dojo";
import { reducer as navigation } from "./navigation";
import { reducer as questions } from "./questions";
import { reducer as study } from "./study";
import { reducer as translations } from "./translations";

const rootReducer = combineReducers({
    study: study,
    translations: translations,
    navigation: navigation,
    content: content,
    questions: questions,
    dojo: dojo,
});

const createRootReducer = () => rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export default createRootReducer;
