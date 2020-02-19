import { SeenContentKeys } from "./";
import { LogActions } from "./actions";

export type LogState = {
    readonly seenContentKeys: SeenContentKeys;
    readonly lastSeenParentContentKey: string;
};

export const defaultState: LogState = {
    seenContentKeys: {},
    lastSeenParentContentKey: "nav.vehicleControls",
};

export const reducer = (state: LogState = defaultState, action: LogActions): LogState => {
    switch (action.type) {
        case "STUDY_LOG_RECIEVE_SEEN_CONTENT_KEY":
            return {
                ...state,
                seenContentKeys: {
                    ...state.seenContentKeys,
                    [action.payload]: true,
                },
            };
        case "STUDY_LOG_RECIEVE_LAST_SEEN_PARENT_CONTENT_KEY":
            return {
                ...state,
                lastSeenParentContentKey: action.payload,
            };
        default:
            return state;
    }
};
