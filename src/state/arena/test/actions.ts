import { QuestionAnswer } from "./";

export const ARENA_TEST_RECIEVE_QUESTION_ANSWERS = "ARENA_TEST_RECIEVE_QUESTION_ANSWERS";
export const ARENA_TEST_RECIEVE_ANSWER = "ARENA_TEST_RECIEVE_ANSWER";

export interface RecieveQuestionAnswersAction {
    type: typeof ARENA_TEST_RECIEVE_QUESTION_ANSWERS;
    payload: QuestionAnswer[];
}

export interface RecieveAnswerAction {
    type: typeof ARENA_TEST_RECIEVE_ANSWER;
    payload: {
        questionId: string;
        answer: string;
    };
}

export type TestActions = RecieveQuestionAnswersAction | RecieveAnswerAction;

export const recieveQuestionAnswers = (
    questionAnswers: QuestionAnswer[]
): RecieveQuestionAnswersAction => ({
    type: ARENA_TEST_RECIEVE_QUESTION_ANSWERS,
    payload: questionAnswers,
});

export const recieveAnswer = (questionId: string, answer: string): RecieveAnswerAction => ({
    type: ARENA_TEST_RECIEVE_ANSWER,
    payload: {
        questionId,
        answer,
    },
});
