export const QUIZ_NAV_RECIEVE_TARGET_NAVIGATION_KEY = "QUIZ_NAV_RECIEVE_TARGET_NAVIGATION_KEY";

export interface RecieveTargetNavigationKeyAction {
  type: typeof QUIZ_NAV_RECIEVE_TARGET_NAVIGATION_KEY;
  payload: string;
}

export type NavigationActions = RecieveTargetNavigationKeyAction;

export const recieveTargetNavigationKey = (key: string): RecieveTargetNavigationKeyAction => ({
  type: QUIZ_NAV_RECIEVE_TARGET_NAVIGATION_KEY,
  payload: key,
});
