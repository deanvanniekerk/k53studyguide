import { applyMiddleware, compose, createStore } from "redux";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

import createRootReducer from "./rootReducer";

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

    let persistor = persistStore(store);

    return { store, persistor };
};
