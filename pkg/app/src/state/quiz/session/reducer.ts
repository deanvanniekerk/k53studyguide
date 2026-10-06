import update from "immutability-helper";
import type { QuestionAnswer, TestActions } from "./";

export type TestState = {
  readonly completionAnalyticsVersion?: 2;
  readonly questionAnswers: QuestionAnswer[];
  readonly maxQuestions: number;
  readonly experienceGained: number;
  readonly completedAt: string | null;
};

export const defaultState: TestState = {
  questionAnswers: [],
  maxQuestions: 10,
  experienceGained: 0,
  completedAt: null,
};

export const reducer = (state: TestState = defaultState, action: TestActions): TestState => {
  switch (action.type) {
    case "QUIZ_SESSION_RECIEVE_QUESTION_ANSWERS":
      return {
        ...state,
        questionAnswers: action.payload,
        completedAt: null,
        completionAnalyticsVersion: 2,
      };
    case "QUIZ_SESSION_RECIEVE_MAX_QUESTIONS":
      return {
        ...state,
        maxQuestions: action.payload,
      };
    case "QUIZ_SESSION_RECIEVE_EXPERIENCE_GAINED":
      return {
        ...state,
        experienceGained: action.payload,
      };
    case "QUIZ_SESSION_RECIEVE_COMPLETED_AT":
      return {
        ...state,
        completedAt: action.payload,
      };
    case "QUIZ_SESSION_RECIEVE_ANSWER": {
      const index = state.questionAnswers.findIndex((q) => q.question.id === action.payload.questionId);
      return {
        ...state,
        // An unanswered legacy attempt can join the new measurement when the learner resumes.
        completionAnalyticsVersion:
          !state.completedAt && state.questionAnswers.some((qa) => !qa.answer) ? 2 : state.completionAnalyticsVersion,
        questionAnswers: update(state.questionAnswers, {
          [index]: {
            answer: {
              $set: action.payload.answer,
            },
          },
        }),
      };
    }
    default:
      return state;
  }
};
