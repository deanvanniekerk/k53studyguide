export const STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY = "STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY";

interface RecieveSeenContentKeyAction {
    type: typeof STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY;
    payload: string;
}

export type LogActions = RecieveSeenContentKeyAction;

export const recieveSeenContentKey = (key: string): RecieveSeenContentKeyAction => ({
    type: STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY,
    payload: key,
});
