import { applyMiddleware, compose, createStore } from "redux";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

import { createPurchaseService, LocalPurchaseService } from "@/purchase";

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
    const purchaseService = createPurchaseService(LocalPurchaseService, store);

    purchaseService.registerProduct();

    return { store, persistor, purchaseService };
};
