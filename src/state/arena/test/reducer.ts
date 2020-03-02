import update from "immutability-helper";

import { QuestionAnswer, TestActions } from "./";

export type TestState = {
    readonly questionAnswers: QuestionAnswer[];
};

export const defaultState: TestState = {
    questionAnswers: [],
};

export const reducer = (state: TestState = defaultState, action: TestActions): TestState => {
    switch (action.type) {
        case "ARENA_TEST_RECIEVE_QUESTION_ANSWERS":
            return {
                ...state,
                questionAnswers: action.payload,
            };
        case "ARENA_TEST_RECIEVE_ANSWER":
            const index = state.questionAnswers.findIndex(
                q => q.question.id === action.payload.questionId
            );
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
        default:
            return state;
    }
};
