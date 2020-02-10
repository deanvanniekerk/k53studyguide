export const CONTENT_RECIEVE_CURRENT_NAVIGATION_KEY = "CONTENT_RECIEVE_CURRENT_NAVIGATION_KEY";

interface RecieveCurrentNavigationKeyAction {
    type: typeof CONTENT_RECIEVE_CURRENT_NAVIGATION_KEY;
    payload: string;
}

export type ContentActions = RecieveCurrentNavigationKeyAction;
