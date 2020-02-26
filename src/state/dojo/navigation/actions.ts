export const DOJO_NAV_RECIEVE_TARGET_NAVIGATION_KEY = "DOJO_NAV_RECIEVE_TARGET_NAVIGATION_KEY";

export interface RecieveTargetNavigationKeyAction {
    type: typeof DOJO_NAV_RECIEVE_TARGET_NAVIGATION_KEY;
    payload: string;
}

export type NavigationActions = RecieveTargetNavigationKeyAction;

export const recieveTargetNavigationKey = (key: string): RecieveTargetNavigationKeyAction => ({
    type: DOJO_NAV_RECIEVE_TARGET_NAVIGATION_KEY,
    payload: key,
});
