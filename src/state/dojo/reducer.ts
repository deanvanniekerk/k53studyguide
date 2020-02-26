import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { createStorage } from "@/store/store";

import { LogState, reducer as log } from "./log";
import { NavigationState, reducer as navigation } from "./navigation";
import { reducer as test, TestState } from "./test";

const testConfig: PersistConfig<TestState> = {
    key: "dojo-test",
    storage: createStorage(),
};

const logConfig: PersistConfig<LogState> = {
    key: "dojo-log",
    storage: createStorage(),
};

const persistNavigationConfig: PersistConfig<NavigationState> = {
    key: "dojo-navigation",
    storage: createStorage(),
};

export const reducer = combineReducers({
    test: persistReducer(testConfig, test),
    log: persistReducer(logConfig, log),
    navigation: persistReducer(persistNavigationConfig, navigation),
});
