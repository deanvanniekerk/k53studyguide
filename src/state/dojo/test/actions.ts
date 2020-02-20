import { QuestionAnswer } from "./";

export const DOJO_TEST_RECIEVE_QUESTION_ANSWERS = "DOJO_TEST_RECIEVE_QUESTION_ANSWERS";
export const DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY = "DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY";

export interface RecieveQuestionAnswersAction {
    type: typeof DOJO_TEST_RECIEVE_QUESTION_ANSWERS;
    payload: QuestionAnswer[];
}

export interface RecieveTargetNavigationKeyAction {
    type: typeof DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY;
    payload: string;
}

export type TestActions = RecieveQuestionAnswersAction | RecieveTargetNavigationKeyAction;

export const recieveQuestionAnswers = (
    questionAnswers: QuestionAnswer[]
): RecieveQuestionAnswersAction => ({
    type: DOJO_TEST_RECIEVE_QUESTION_ANSWERS,
    payload: questionAnswers,
});

export const recieveTargetNavigationKey = (key: string): RecieveTargetNavigationKeyAction => ({
    type: DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY,
    payload: key,
});
