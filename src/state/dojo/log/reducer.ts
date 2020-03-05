import { QuesionsSuccesfullyAnsweredDates } from "./";
import { LogActions } from "./actions";

export type LogState = {
    readonly quesionsSuccesfullyAnsweredDates: QuesionsSuccesfullyAnsweredDates;
};

export const defaultState: LogState = {
    quesionsSuccesfullyAnsweredDates: {},
};

export const reducer = (state: LogState = defaultState, action: LogActions): LogState => {
    switch (action.type) {
        case "DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE":
            return {
                ...state,
                quesionsSuccesfullyAnsweredDates: {
                    ...state.quesionsSuccesfullyAnsweredDates,
                    [action.payload.questionId]: action.payload.date,
                },
            };
        case "DOJO_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES":
            return {
                ...state,
                quesionsSuccesfullyAnsweredDates: {},
            };
        default:
            return state;
    }
};
