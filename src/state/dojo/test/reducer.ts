import { QuestionAnswer, TestActions } from "./";

export type TestState = {
    readonly questionAnswers: QuestionAnswer[];
};

export const defaultState: TestState = {
    questionAnswers: [],
};

export const reducer = (state: TestState = defaultState, action: TestActions): TestState => {
    switch (action.type) {
        case "DOJO_TEST_RECIEVE_QUESTION_ANSWERS":
            return {
                ...state,
                questionAnswers: action.payload,
            };
        default:
            return state;
    }
};
