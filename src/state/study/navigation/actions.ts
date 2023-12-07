export const STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY = 'STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY';

export interface RecieveCurrentNavigationKeyAction {
  type: typeof STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY;
  payload: string;
}

export type NavigationActions = RecieveCurrentNavigationKeyAction;

export const recieveCurrentNavigationKey = (key: string): RecieveCurrentNavigationKeyAction => ({
  type: STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY,
  payload: key,
});
