import { Capacitor } from "@capacitor/core";
import type { Middleware, StoreEnhancer } from "redux";
import { applyMiddleware, compose, createStore } from "redux";
import { persistStore } from "redux-persist";
import { thunk } from "redux-thunk";
import { createPurchaseService, LocalPurchaseService, RevenueCatPurchaseService } from "@/services";
import type { PurchaseStore } from "@/services/purchase/types";
import loggerMiddleware from "./middleware/loggerMiddleware";
import createRootReducer from "./rootReducer";

const enhancers: StoreEnhancer[] = [];
if (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() as StoreEnhancer);
}

const middleware = [thunk, loggerMiddleware as Middleware];

export const shouldUseRevenueCatPurchaseService = (environment: string, platform: string) => {
  return environment === "production" && platform !== "web";
};

export const configureStore = () => {
  const middlewareEnhancer = applyMiddleware(...middleware) as StoreEnhancer;
  const storeEnhancer = compose(middlewareEnhancer, ...enhancers) as StoreEnhancer;

  const store = createStore(
    createRootReducer(),
    undefined, // preloaded state
    storeEnhancer,
  );

  const persistor = persistStore(store as unknown as PurchaseStore);

  const purchaseStore = store as unknown as PurchaseStore;
  let purchaseService = createPurchaseService(LocalPurchaseService, purchaseStore);

  if (shouldUseRevenueCatPurchaseService(__ENVIRONMENT__, Capacitor.getPlatform()))
    purchaseService = createPurchaseService(RevenueCatPurchaseService, purchaseStore);

  return { store, persistor, purchaseService };
};
