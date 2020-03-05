import { LogState, reducer } from "./reducer";

describe("state > study > log > reducer", () => {
    const defaultState: LogState = {
        seenContentKeys: {
            key1: true,
        },
        lastSeenParentContentKey: "key1",
    };

    it("should handle STUDY_LOG_RECIEVE_SEEN_CONTENT_KEY", () => {
        const actualState = reducer(defaultState, {
            type: "STUDY_LOG_RECIEVE_SEEN_CONTENT_KEY",
            payload: "key2",
        });

        const expectedState = {
            ...defaultState,
            seenContentKeys: {
                ...defaultState.seenContentKeys,
                key2: true,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STUDY_LOG_RECIEVE_SEEN_CONTENT_KEY - already seen", () => {
        const state = {
            ...defaultState,
            seenContentKeys: {
                ...defaultState.seenContentKeys,
                key2: true,
            },
        };

        const actualState = reducer(state, {
            type: "STUDY_LOG_RECIEVE_SEEN_CONTENT_KEY",
            payload: "key2",
        });

        const expectedState = {
            ...state,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STUDY_LOG_RECIEVE_LAST_SEEN_PARENT_CONTENT_KEY", () => {
        const actualState = reducer(defaultState, {
            type: "STUDY_LOG_RECIEVE_LAST_SEEN_PARENT_CONTENT_KEY",
            payload: "key2",
        });

        const expectedState = {
            ...defaultState,
            lastSeenParentContentKey: "key2",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STUDY_LOG_CLEAR_SEEN_CONTENT", () => {
        const actualState = reducer(defaultState, {
            type: "STUDY_LOG_CLEAR_SEEN_CONTENT",
        });

        const expectedState = {
            ...defaultState,
            seenContentKeys: {},
        };

        expect(actualState).toEqual(expectedState);
    });
});
