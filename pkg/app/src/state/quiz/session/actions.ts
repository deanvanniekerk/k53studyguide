import type { QuestionAnswer } from "./";

export const QUIZ_SESSION_RECIEVE_QUESTION_ANSWERS = "QUIZ_SESSION_RECIEVE_QUESTION_ANSWERS";
export const QUIZ_SESSION_RECIEVE_MAX_QUESTIONS = "QUIZ_SESSION_RECIEVE_MAX_QUESTIONS";
export const QUIZ_SESSION_RECIEVE_ANSWER = "QUIZ_SESSION_RECIEVE_ANSWER";
export const QUIZ_SESSION_RECIEVE_EXPERIENCE_GAINED = "QUIZ_SESSION_RECIEVE_EXPERIENCE_GAINED";
export const QUIZ_SESSION_RECIEVE_COMPLETED_AT = "QUIZ_SESSION_RECIEVE_COMPLETED_AT";

export interface RecieveQuestionAnswersAction {
  type: typeof QUIZ_SESSION_RECIEVE_QUESTION_ANSWERS;
  payload: QuestionAnswer[];
}

export interface RecieveAnswerAction {
  type: typeof QUIZ_SESSION_RECIEVE_ANSWER;
  payload: {
    questionId: string;
    answer: string;
  };
}

export interface RecieveMaxQuestionsAction {
  type: typeof QUIZ_SESSION_RECIEVE_MAX_QUESTIONS;
  payload: number;
}

export interface RecieveExperienceGainedAction {
  type: typeof QUIZ_SESSION_RECIEVE_EXPERIENCE_GAINED;
  payload: number;
}

export interface RecieveCompletedAtAction {
  type: typeof QUIZ_SESSION_RECIEVE_COMPLETED_AT;
  payload: string | null;
}

export type TestActions =
  | RecieveQuestionAnswersAction
  | RecieveAnswerAction
  | RecieveMaxQuestionsAction
  | RecieveExperienceGainedAction
  | RecieveCompletedAtAction;

export const recieveQuestionAnswers = (questionAnswers: QuestionAnswer[]): RecieveQuestionAnswersAction => ({
  type: QUIZ_SESSION_RECIEVE_QUESTION_ANSWERS,
  payload: questionAnswers,
});

export const recieveAnswer = (questionId: string, answer: string): RecieveAnswerAction => ({
  type: QUIZ_SESSION_RECIEVE_ANSWER,
  payload: {
    questionId,
    answer,
  },
});

export const recieveMaxQuestions = (maxQuestions: number): RecieveMaxQuestionsAction => ({
  type: QUIZ_SESSION_RECIEVE_MAX_QUESTIONS,
  payload: maxQuestions,
});

export const recieveExperienceGained = (experience: number): RecieveExperienceGainedAction => ({
  type: QUIZ_SESSION_RECIEVE_EXPERIENCE_GAINED,
  payload: experience,
});

export const recieveCompletedAt = (completedAt: string | null): RecieveCompletedAtAction => ({
  type: QUIZ_SESSION_RECIEVE_COMPLETED_AT,
  payload: completedAt,
});
