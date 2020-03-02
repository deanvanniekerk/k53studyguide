import { QuesionsSuccesfullyAnsweredDates } from "./";
import { LogActions } from "./actions";

export type LogState = {
    readonly quesionsSuccesfullyAnsweredDates: QuesionsSuccesfullyAnsweredDates;
    readonly testsPassed: number;
};

export const defaultState: LogState = {
    quesionsSuccesfullyAnsweredDates: {},
    testsPassed: 0,
};

export const reducer = (state: LogState = defaultState, action: LogActions): LogState => {
    switch (action.type) {
        case "ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE":
            return {
                ...state,
                quesionsSuccesfullyAnsweredDates: {
                    ...state.quesionsSuccesfullyAnsweredDates,
                    [action.payload.questionId]: action.payload.date,
                },
            };
        case "ARENA_LOG_INCREMENT_PASSED_TESTS":
            return {
                ...state,
                testsPassed: state.testsPassed + 1,
            };
        default:
            return state;
    }
};
