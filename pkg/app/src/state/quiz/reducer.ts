import { combineReducers } from "redux";
import { type PersistConfig, persistReducer } from "redux-persist";
import { createStorage } from "@/store/store";
import { legacyPersistKeys } from "../legacyCompatibility";
import { type LogState, reducer as log } from "./log";
import { type NavigationState, reducer as navigation } from "./navigation";
import { reducer as session, type TestState } from "./session";

const sessionConfig: PersistConfig<TestState> = {
  key: "quiz-session",
  storage: createStorage({ legacyKey: legacyPersistKeys.quizSession }),
};

const logConfig: PersistConfig<LogState> = {
  key: "quiz-log",
  storage: createStorage({ legacyKey: legacyPersistKeys.quizLog }),
};

const persistNavigationConfig: PersistConfig<NavigationState> = {
  key: "quiz-navigation",
  storage: createStorage({ legacyKey: legacyPersistKeys.quizNavigation }),
};

export const reducer = combineReducers({
  session: persistReducer(sessionConfig, session),
  log: persistReducer(logConfig, log),
  navigation: persistReducer(persistNavigationConfig, navigation),
});
