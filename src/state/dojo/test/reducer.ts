import { ROOT_NAVIGATION_KEY } from "@/state/navigation";

import { QuestionAnswer, TestActions } from "./";

export type TestState = {
    readonly questionAnswers: QuestionAnswer[];
    readonly targetNavigationKey: string;
};

export const defaultState: TestState = {
    questionAnswers: [],
    targetNavigationKey: ROOT_NAVIGATION_KEY,
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
        default:
            return state;
    }
};
