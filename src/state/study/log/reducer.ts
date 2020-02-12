import { SeenContent } from "../";
import { LogActions, recieveSeenContentKey } from "./actions";

export type LogState = {
    readonly seenContent: SeenContent;
};

export const defaultState: LogState = {
    seenContent: {},
};

export const reducer = (state: LogState = defaultState, action: LogActions): LogState => {
    switch (action.type) {
        case "STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY":
            return {
                ...state,
                seenContent: {
                    ...state.seenContent,
                    [action.payload]: true,
                },
            };
        default:
            return state;
    }
};
