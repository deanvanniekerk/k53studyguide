import { ThunkAction } from "redux-thunk";
import { RootState } from "src/state";

import {
    currentNavigationKeySelector,
    recieveCurrentNavigationKey,
    RecieveCurrentNavigationKeyAction,
} from "./";

export const navigateUp = (): ThunkAction<
    void,
    RootState,
    null,
    RecieveCurrentNavigationKeyAction
> => {
    return (dispatch, getState) => {
        let key = currentNavigationKeySelector(getState());

        const split = key.split(".");

        if (split.length > 1) {
            split.pop(); //remove last
            key = split.join(".");
        }

        dispatch(recieveCurrentNavigationKey(key));
    };
};
