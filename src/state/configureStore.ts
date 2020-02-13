import { compose, createStore, Store } from "redux";

import createRootReducer, { RootActions, RootState } from "./rootReducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enhancers = [] as any;
if (window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]) {
    enhancers.push(window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]());
}

export const configureStore = (): Store<RootState, RootActions> => {
    const store = createStore(
        createRootReducer(),
        undefined, // preloaded state
        compose(...enhancers)
    );

    return store;
};
