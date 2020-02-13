import { SeenContentKeys } from "./";
import { LogActions } from "./actions";

export type LogState = {
    readonly seenContentKeys: SeenContentKeys;
};

export const defaultState: LogState = {
    seenContentKeys: {},
};

export const reducer = (state: LogState = defaultState, action: LogActions): LogState => {
    switch (action.type) {
        case "STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY":
            return {
                ...state,
                seenContentKeys: {
                    ...state.seenContentKeys,
                    [action.payload]: true,
                },
            };
        default:
            return state;
    }
};
