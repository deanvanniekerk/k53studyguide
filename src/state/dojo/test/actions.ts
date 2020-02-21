import { QuestionAnswer } from "./";

export const DOJO_TEST_RECIEVE_QUESTION_ANSWERS = "DOJO_TEST_RECIEVE_QUESTION_ANSWERS";
export const DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY = "DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY";
export const DOJO_TEST_RECIEVE_ANSWER = "DOJO_TEST_RECIEVE_ANSWER";

export interface RecieveQuestionAnswersAction {
    type: typeof DOJO_TEST_RECIEVE_QUESTION_ANSWERS;
    payload: QuestionAnswer[];
}

export interface RecieveTargetNavigationKeyAction {
    type: typeof DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY;
    payload: string;
}

export interface RecieveAnswerAction {
    type: typeof DOJO_TEST_RECIEVE_ANSWER;
    payload: {
        questionId: string;
        answer: string;
    };
}

export type TestActions =
    | RecieveQuestionAnswersAction
    | RecieveTargetNavigationKeyAction
    | RecieveAnswerAction;

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

export const recieveAnswer = (questionId: string, answer: string): RecieveAnswerAction => ({
    type: DOJO_TEST_RECIEVE_ANSWER,
    payload: {
        questionId,
        answer,
    },
});
