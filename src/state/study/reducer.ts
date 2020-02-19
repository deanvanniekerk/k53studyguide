import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { createStorage } from "src/store/store";

import { reducer as content } from "./content";
import { reducer as log } from "./log";
import { reducer as navigation } from "./navigation";

const persistConfig = {
    key: "study",
    storage: createStorage(),
    whitelist: ["log"],
};

const combinedReducers = combineReducers({
    content: content,
    navigation: navigation,
    log: log,
});

export const reducer = persistReducer(persistConfig, combinedReducers);
