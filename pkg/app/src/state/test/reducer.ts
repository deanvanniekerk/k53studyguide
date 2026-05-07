import { combineReducers } from "redux";
import { type PersistConfig, persistReducer } from "redux-persist";
import { createStorage } from "@/store/store";
import { legacyPersistKeys } from "../legacyCompatibility";
import { type LogState, reducer as log } from "./log";
import { reducer as session, type TestState } from "./session";

const sessionConfig: PersistConfig<TestState> = {
  key: "test-session",
  storage: createStorage({ legacyKey: legacyPersistKeys.testSession }),
};

const logConfig: PersistConfig<LogState> = {
  key: "test-log",
  storage: createStorage({ legacyKey: legacyPersistKeys.testLog }),
};

export const reducer = combineReducers({
  session: persistReducer(sessionConfig, session),
  log: persistReducer(logConfig, log),
});
