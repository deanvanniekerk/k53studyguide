export const TEST_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE =
  "TEST_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE";
export const TEST_LOG_INCREMENT_PASSED_TESTS = "TEST_LOG_INCREMENT_PASSED_TESTS";
export const TEST_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES =
  "TEST_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES";
export const TEST_LOG_CLEAR_PASSED_TESTS = "TEST_LOG_CLEAR_PASSED_TESTS";

export interface RecieveQuesionSuccesfullyAnsweredDateAction {
  type: typeof TEST_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE;
  payload: {
    questionId: string;
    date: string;
  };
}

export interface ClearQuesionSuccesfullyAnsweredDatesAction {
  type: typeof TEST_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES;
}

export interface IncrementPassedTestsAction {
  type: typeof TEST_LOG_INCREMENT_PASSED_TESTS;
}

export interface ClearPassedTestsAction {
  type: typeof TEST_LOG_CLEAR_PASSED_TESTS;
}

export type LogActions =
  | RecieveQuesionSuccesfullyAnsweredDateAction
  | IncrementPassedTestsAction
  | ClearQuesionSuccesfullyAnsweredDatesAction
  | ClearPassedTestsAction;

export const recieveQuesionSuccesfullyAnsweredDate = (
  questionId: string,
  date: string,
): RecieveQuesionSuccesfullyAnsweredDateAction => ({
  type: TEST_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE,
  payload: {
    questionId,
    date,
  },
});

export const incrementPassedTests = (): IncrementPassedTestsAction => ({
  type: TEST_LOG_INCREMENT_PASSED_TESTS,
});

export const clearQuesionSuccesfullyAnsweredDates = (): ClearQuesionSuccesfullyAnsweredDatesAction => ({
  type: TEST_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES,
});

export const clearPassedTests = (): ClearPassedTestsAction => ({
  type: TEST_LOG_CLEAR_PASSED_TESTS,
});
