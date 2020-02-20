import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { createStorage } from "@/store/store";

import { reducer as test, TestState } from "./test";

const testLogConfig: PersistConfig<TestState> = {
    key: "dojo-test",
    storage: createStorage(),
};

export const reducer = combineReducers({
    test: persistReducer(testLogConfig, test),
});
