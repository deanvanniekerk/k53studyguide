import type { QuestionAnswer, TestSection } from "./";

export const TEST_SESSION_RECIEVE_QUESTION_ANSWERS = "TEST_SESSION_RECIEVE_QUESTION_ANSWERS";
export const TEST_SESSION_RECIEVE_ANSWER = "TEST_SESSION_RECIEVE_ANSWER";
export const TEST_SESSION_RECIEVE_CURRENT_SECTION = "TEST_SESSION_RECIEVE_CURRENT_SECTION";

export interface RecieveQuestionAnswersAction {
  type: typeof TEST_SESSION_RECIEVE_QUESTION_ANSWERS;
  payload: QuestionAnswer[];
}

export interface RecieveAnswerAction {
  type: typeof TEST_SESSION_RECIEVE_ANSWER;
  payload: {
    questionId: string;
    answer: string;
  };
}

export interface RecieveCurrentSectionAction {
  type: typeof TEST_SESSION_RECIEVE_CURRENT_SECTION;
  payload: TestSection;
}

export type TestActions = RecieveQuestionAnswersAction | RecieveAnswerAction | RecieveCurrentSectionAction;

export const recieveQuestionAnswers = (questionAnswers: QuestionAnswer[]): RecieveQuestionAnswersAction => ({
  type: TEST_SESSION_RECIEVE_QUESTION_ANSWERS,
  payload: questionAnswers,
});

export const recieveAnswer = (questionId: string, answer: string): RecieveAnswerAction => ({
  type: TEST_SESSION_RECIEVE_ANSWER,
  payload: {
    questionId,
    answer,
  },
});

export const recieveCurrentSection = (section: TestSection): RecieveCurrentSectionAction => ({
  type: TEST_SESSION_RECIEVE_CURRENT_SECTION,
  payload: section,
});
