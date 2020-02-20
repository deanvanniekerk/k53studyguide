import { QuestionAnswer } from "./";

export const DOJO_TEST_RECIEVE_QUESTION_ANSWERS = "DOJO_TEST_RECIEVE_QUESTION_ANSWERS";

export interface RecieveQuestionAnswersAction {
    type: typeof DOJO_TEST_RECIEVE_QUESTION_ANSWERS;
    payload: QuestionAnswer[];
}

export type TestActions = RecieveQuestionAnswersAction;

export const recieveQuestionAnswers = (
    questionAnswers: QuestionAnswer[]
): RecieveQuestionAnswersAction => ({
    type: DOJO_TEST_RECIEVE_QUESTION_ANSWERS,
    payload: questionAnswers,
});
