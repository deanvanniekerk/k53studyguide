import { applyMiddleware, compose, createStore } from "redux";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

import { CordovaPurchaseService, createPurchaseService, LocalPurchaseService } from "@/services";

import createRootReducer from "./rootReducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enhancers = [] as any;
if (window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]) {
    enhancers.push(window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]());
}

const middleware = [thunk];

export const configureStore = () => {
    const store = createStore(
        createRootReducer(),
        undefined, // preloaded state
        compose(applyMiddleware(...middleware), ...enhancers)
    );

    const persistor = persistStore(store);

    let purchaseService = createPurchaseService(LocalPurchaseService, store);

    if (__ENVIRONMENT__ === "production")
        purchaseService = createPurchaseService(CordovaPurchaseService, store);

    return { store, persistor, purchaseService };
};
