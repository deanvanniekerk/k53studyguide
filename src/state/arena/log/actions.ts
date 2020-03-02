export const ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE =
    "ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE";
export const ARENA_LOG_INCREMENT_PASSED_TESTS = "ARENA_LOG_INCREMENT_PASSED_TESTS";

export interface RecieveQuesionSuccesfullyAnsweredDateAction {
    type: typeof ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE;
    payload: {
        questionId: string;
        date: Date;
    };
}

export interface IncrementPassedTestsAction {
    type: typeof ARENA_LOG_INCREMENT_PASSED_TESTS;
}

export type LogActions = RecieveQuesionSuccesfullyAnsweredDateAction | IncrementPassedTestsAction;

export const recieveQuesionSuccesfullyAnsweredDate = (
    questionId: string,
    date: Date
): RecieveQuesionSuccesfullyAnsweredDateAction => ({
    type: ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE,
    payload: {
        questionId,
        date,
    },
});

export const incrementPassedTestsAction = (): IncrementPassedTestsAction => ({
    type: ARENA_LOG_INCREMENT_PASSED_TESTS,
});
