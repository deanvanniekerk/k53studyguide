import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";
import { createStorage } from "src/store/store";

import { reducer as content } from "./content";
import { LogState, reducer as log } from "./log";
import { reducer as navigation } from "./navigation";

const persistLogConfig: PersistConfig<LogState> = {
    key: "study-log",
    storage: createStorage(),
};

export const reducer = combineReducers({
    content: content,
    navigation: navigation,
    log: persistReducer(persistLogConfig, log),
});
