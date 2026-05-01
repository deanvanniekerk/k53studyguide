import type { ThunkAction } from "redux-thunk";
import type { RootState } from "@/state";
import { navigateUp as up } from "@/utils";
import { type RecieveTargetNavigationKeyAction, recieveTargetNavigationKey, targetNavigationKeySelector } from "./";

export const navigateUp = (): ThunkAction<void, RootState, null, RecieveTargetNavigationKeyAction> => {
  return (dispatch, getState) => {
    let key = targetNavigationKeySelector(getState());

    key = up(key);

    dispatch(recieveTargetNavigationKey(key));
  };
};
