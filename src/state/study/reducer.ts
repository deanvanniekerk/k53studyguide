import { combineReducers } from "redux";
import { type PersistConfig, persistReducer } from "redux-persist";
import { createStorage } from "@/store/store";
import { type LogState, reducer as log } from "./log";
import { type NavigationState, reducer as navigation } from "./navigation";

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
