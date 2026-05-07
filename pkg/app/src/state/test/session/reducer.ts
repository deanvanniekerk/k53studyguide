import update from "immutability-helper";
import type { QuestionAnswer, TestActions, TestSection } from "./";

export type TestState = {
  readonly questionAnswers: QuestionAnswer[];
  readonly currentSection: TestSection;
};

export const defaultState: TestState = {
  questionAnswers: [],
  currentSection: "A",
};

export const reducer = (state: TestState = defaultState, action: TestActions): TestState => {
  switch (action.type) {
    case "TEST_SESSION_RECIEVE_QUESTION_ANSWERS":
      return {
        ...state,
        questionAnswers: action.payload,
      };
    case "TEST_SESSION_RECIEVE_CURRENT_SECTION":
      return {
        ...state,
        currentSection: action.payload,
      };
    case "TEST_SESSION_RECIEVE_ANSWER": {
      const index = state.questionAnswers.findIndex((q) => q.question.id === action.payload.questionId);
      return {
        ...state,
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
