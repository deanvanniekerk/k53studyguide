import { LogState, reducer } from "./reducer";

describe("state > study > log > reducer", () => {
    const date1 = new Date();
    const defaultState: LogState = {
        quesionsSuccesfullyAnsweredDates: {
            "1": date1,
        },
    };

    it("should handle DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE", () => {
        const date2 = new Date();
        const actualState = reducer(defaultState, {
            type: "DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE",
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

    it("should handle DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE - already answered", () => {
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
            type: "DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE",
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
});
