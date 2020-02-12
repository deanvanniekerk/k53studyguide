import { LogState, reducer } from "@/state/study/log";

describe("state > study > log > reducer", () => {
    const defaultState: LogState = {
        seenContent: {
            key1: true,
        },
    };

    it("should handle STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY", () => {
        const actualState = reducer(defaultState, {
            type: "STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY",
            payload: "key2",
        });

        const expectedState = {
            ...defaultState,
            seenContent: {
                ...defaultState.seenContent,
                key2: true,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY - already seen", () => {
        const state = {
            ...defaultState,
            seenContent: {
                ...defaultState.seenContent,
                key2: true,
            },
        };

        const actualState = reducer(state, {
            type: "STUDY_LOG_RECIEVE_CONTENT_SEEN_KEY",
            payload: "key2",
        });

        const expectedState = {
            ...state,
        };

        expect(actualState).toEqual(expectedState);
    });
});
