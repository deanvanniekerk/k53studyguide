import { QuestionAnswer } from './';

export const DOJO_TEST_RECIEVE_QUESTION_ANSWERS = 'DOJO_TEST_RECIEVE_QUESTION_ANSWERS';
export const DOJO_TEST_RECIEVE_MAX_QUESTIONS = 'DOJO_TEST_RECIEVE_MAX_QUESTIONS';
export const DOJO_TEST_RECIEVE_ANSWER = 'DOJO_TEST_RECIEVE_ANSWER';
export const DOJO_TEST_RECIEVE_EXPERIENCE_GAINED = 'DOJO_TEST_RECIEVE_EXPERIENCE_GAINED';

export interface RecieveQuestionAnswersAction {
  type: typeof DOJO_TEST_RECIEVE_QUESTION_ANSWERS;
  payload: QuestionAnswer[];
}

export interface RecieveAnswerAction {
  type: typeof DOJO_TEST_RECIEVE_ANSWER;
  payload: {
    questionId: string;
    answer: string;
  };
}

export interface RecieveMaxQuestionsAction {
  type: typeof DOJO_TEST_RECIEVE_MAX_QUESTIONS;
  payload: number;
}

export interface RecieveExperienceGainedAction {
  type: typeof DOJO_TEST_RECIEVE_EXPERIENCE_GAINED;
  payload: number;
}

export type TestActions =
  | RecieveQuestionAnswersAction
  | RecieveAnswerAction
  | RecieveMaxQuestionsAction
  | RecieveExperienceGainedAction;

export const recieveQuestionAnswers = (questionAnswers: QuestionAnswer[]): RecieveQuestionAnswersAction => ({
  type: DOJO_TEST_RECIEVE_QUESTION_ANSWERS,
  payload: questionAnswers,
});

export const recieveAnswer = (questionId: string, answer: string): RecieveAnswerAction => ({
  type: DOJO_TEST_RECIEVE_ANSWER,
  payload: {
    questionId,
    answer,
  },
});

export const recieveMaxQuestions = (maxQuestions: number): RecieveMaxQuestionsAction => ({
  type: DOJO_TEST_RECIEVE_MAX_QUESTIONS,
  payload: maxQuestions,
});

export const recieveExperienceGained = (experience: number): RecieveExperienceGainedAction => ({
  type: DOJO_TEST_RECIEVE_EXPERIENCE_GAINED,
  payload: experience,
});
