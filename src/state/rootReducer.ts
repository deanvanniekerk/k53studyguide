import { combineReducers } from "redux";

import { reducer as study } from "./study";
import { reducer as translations } from "./translations";

const rootReducer = combineReducers({
    study: study,
    translations: translations,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
