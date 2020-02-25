import update from "immutability-helper";

import { ROOT_NAVIGATION_KEY } from "@/state/navigation";

import { QuestionAnswer, TestActions } from "./";

export const TOTAL_QUESTIONS = 414;

export type TestState = {
    readonly questionAnswers: QuestionAnswer[];
    readonly targetNavigationKey: string;
    readonly maxQuestions: number;
    readonly experienceGained: number;
};

export const defaultState: TestState = {
    questionAnswers: [],
    targetNavigationKey: ROOT_NAVIGATION_KEY,
    maxQuestions: 10,
    experienceGained: 0,
};

export const reducer = (state: TestState = defaultState, action: TestActions): TestState => {
    switch (action.type) {
        case "DOJO_TEST_RECIEVE_QUESTION_ANSWERS":
            return {
                ...state,
                questionAnswers: action.payload,
            };
        case "DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY":
            return {
                ...state,
                targetNavigationKey: action.payload,
            };
        case "DOJO_TEST_RECIEVE_MAX_QUESTIONS":
            return {
                ...state,
                maxQuestions: action.payload,
            };
        case "DOJO_TEST_RECIEVE_EXPERIENCE_GAINED":
            return {
                ...state,
                experienceGained: action.payload,
            };
        case "DOJO_TEST_RECIEVE_ANSWER":
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
