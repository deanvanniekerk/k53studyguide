import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";
import { createStorage } from "src/store/store";

import { LogState, reducer as log } from "./log";
import { NavigationState, reducer as navigation } from "./navigation";

const persistLogConfig: PersistConfig<LogState> = {
    key: "study-log",
    storage: createStorage(),
};

const persistNavigationConfig: PersistConfig<NavigationState> = {
    key: "study-navigation",
    storage: createStorage(),
};

export const reducer = combineReducers({
    navigation: persistReducer(persistNavigationConfig, navigation),
    log: persistReducer(persistLogConfig, log),
});
