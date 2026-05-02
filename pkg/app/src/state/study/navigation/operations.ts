import type { ThunkAction } from "redux-thunk";
import type { RootState } from "@/state";
import { navigateUp as up } from "@/utils";
import { currentNavigationKeySelector, type RecieveCurrentNavigationKeyAction, recieveCurrentNavigationKey } from "./";

export const navigateUp = (): ThunkAction<void, RootState, null, RecieveCurrentNavigationKeyAction> => {
  return (dispatch, getState) => {
    let key = currentNavigationKeySelector(getState());

    key = up(key);

    dispatch(recieveCurrentNavigationKey(key));
  };
};
