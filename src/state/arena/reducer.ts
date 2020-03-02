import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { createStorage } from "@/store/store";

import { LogState, reducer as log } from "./log";
import { reducer as test, TestState } from "./test";

const testConfig: PersistConfig<TestState> = {
    key: "arena-test",
    storage: createStorage(),
};

const logConfig: PersistConfig<LogState> = {
    key: "arena-log",
    storage: createStorage(),
};

export const reducer = combineReducers({
    test: persistReducer(testConfig, test),
    log: persistReducer(logConfig, log),
});
