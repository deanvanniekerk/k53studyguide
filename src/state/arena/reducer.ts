import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { createStorage } from "@/store/store";

import { reducer as test, TestState } from "./test";

const testConfig: PersistConfig<TestState> = {
    key: "dojo-test",
    storage: createStorage(),
};

export const reducer = combineReducers({
    test: persistReducer(testConfig, test),
});
