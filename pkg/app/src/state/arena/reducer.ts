import { combineReducers } from "redux";
import { type PersistConfig, persistReducer } from "redux-persist";
import { createStorage } from "@/store/store";
import { type LogState, reducer as log } from "./log";
import { type TestState, reducer as test } from "./test";

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
