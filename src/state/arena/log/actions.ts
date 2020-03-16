export const ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE =
    "ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE";
export const ARENA_LOG_INCREMENT_PASSED_TESTS = "ARENA_LOG_INCREMENT_PASSED_TESTS";
export const ARENA_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES =
    "ARENA_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES";
export const ARENA_LOG_CLEAR_PASSED_TESTS = "ARENA_LOG_CLEAR_PASSED_TESTS";

export interface RecieveQuesionSuccesfullyAnsweredDateAction {
    type: typeof ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE;
    payload: {
        questionId: string;
        date: string;
    };
}

export interface ClearQuesionSuccesfullyAnsweredDatesAction {
    type: typeof ARENA_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES;
}

export interface IncrementPassedTestsAction {
    type: typeof ARENA_LOG_INCREMENT_PASSED_TESTS;
}

export interface ClearPassedTestsAction {
    type: typeof ARENA_LOG_CLEAR_PASSED_TESTS;
}

export type LogActions =
    | RecieveQuesionSuccesfullyAnsweredDateAction
    | IncrementPassedTestsAction
    | ClearQuesionSuccesfullyAnsweredDatesAction
    | ClearPassedTestsAction;

export const recieveQuesionSuccesfullyAnsweredDate = (
    questionId: string,
    date: string
): RecieveQuesionSuccesfullyAnsweredDateAction => ({
    type: ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE,
    payload: {
        questionId,
        date,
    },
});

export const incrementPassedTests = (): IncrementPassedTestsAction => ({
    type: ARENA_LOG_INCREMENT_PASSED_TESTS,
});

export const clearQuesionSuccesfullyAnsweredDates = (): ClearQuesionSuccesfullyAnsweredDatesAction => ({
    type: ARENA_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES,
});

export const clearPassedTests = (): ClearPassedTestsAction => ({
    type: ARENA_LOG_CLEAR_PASSED_TESTS,
});
