import { compose, createStore } from "redux";

import createRootReducer from "./rootReducer";

const enhancers = [] as any;
if (window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]) {
    enhancers.push(window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]());
}

export const configureStore = () => {
    const store = createStore(
        createRootReducer(),
        undefined, // preloaded state
        compose(...enhancers)
    );

    return store;
};
