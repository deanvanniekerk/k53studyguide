import { combineReducers } from "redux";

import { reducer as content } from "./content";
import { reducer as navigation } from "./navigation";
import { reducer as study } from "./study";
import { reducer as translations } from "./translations";

const rootReducer = combineReducers({
    study: study,
    translations: translations,
    navigation: navigation,
    content: content,
});

const createRootReducer = () => rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export default createRootReducer;
