import { LogState, reducer } from "./reducer";

describe("state > arena > log > reducer", () => {
    const date1 = new Date();
    const defaultState: LogState = {
        quesionsSuccesfullyAnsweredDates: {
            "1": date1,
        },
        testsPassed: 0,
    };

    it("should handle ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE", () => {
        const date2 = new Date();
        const actualState = reducer(defaultState, {
            type: "ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE",
            payload: {
                questionId: "2",
                date: date2,
            },
        });

        const expectedState = {
            ...defaultState,
            quesionsSuccesfullyAnsweredDates: {
                ...defaultState.quesionsSuccesfullyAnsweredDates,
                "2": date2,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE - already answered", () => {
        const date2 = new Date();
        const date3 = new Date();
        const state = {
            ...defaultState,
            quesionsSuccesfullyAnsweredDates: {
                ...defaultState.quesionsSuccesfullyAnsweredDates,
                "2": date2,
            },
        };

        const actualState = reducer(state, {
            type: "ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE",
            payload: {
                questionId: "2",
                date: date3,
            },
        });

        const expectedState = {
            ...defaultState,
            quesionsSuccesfullyAnsweredDates: {
                ...defaultState.quesionsSuccesfullyAnsweredDates,
                "2": date2,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle ARENA_LOG_INCREMENT_PASSED_TESTS", () => {
        const state = {
            ...defaultState,
            testsPassed: 5,
        };

        const actualState = reducer(state, {
            type: "ARENA_LOG_INCREMENT_PASSED_TESTS",
        });

        const expectedState = {
            ...defaultState,
            testsPassed: 6,
        };

        expect(actualState).toEqual(expectedState);
    });
});
