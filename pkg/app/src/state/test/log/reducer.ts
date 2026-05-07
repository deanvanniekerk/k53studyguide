import type { QuesionsSuccesfullyAnsweredDates } from "./";
import type { LogActions } from "./actions";

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
    case "TEST_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE":
      return {
        ...state,
        quesionsSuccesfullyAnsweredDates: {
          ...state.quesionsSuccesfullyAnsweredDates,
          [action.payload.questionId]: action.payload.date,
        },
      };
    case "TEST_LOG_INCREMENT_PASSED_TESTS":
      return {
        ...state,
        testsPassed: state.testsPassed + 1,
      };
    case "TEST_LOG_CLEAR_PASSED_TESTS":
      return {
        ...state,
        testsPassed: 0,
      };
    case "TEST_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES":
      return {
        ...state,
        quesionsSuccesfullyAnsweredDates: {},
      };
    default:
      return state;
  }
};
