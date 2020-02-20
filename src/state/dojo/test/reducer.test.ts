import { reducer, TestState } from "./reducer";

describe("state > dojo > test > reducer", () => {
    const defaultState: TestState = {
        questionAnswers: [],
        targetNavigationKey: "nav",
    };

    it("should handle DOJO_TEST_RECIEVE_QUESTION_ANSWERS", () => {
        const questionAnswers = [
            {
                answer: null,
                question: {
                    id: "1",
                    answer: "C",
                    text: "When you only have a learner's licence you are not allowed to:",
                    option: [
                        {
                            id: "A",
                            value: "Carry passengers in your car.",
                        },
                        {
                            id: "B",
                            value: "Drive faster than 100km/h.",
                        },
                        {
                            id: "C",
                            value: "Drive without having your licence with you.",
                        },
                    ],
                },
            },
        ];

        const actualState = reducer(defaultState, {
            type: "DOJO_TEST_RECIEVE_QUESTION_ANSWERS",
            payload: questionAnswers,
        });

        const expectedState = {
            ...defaultState,
            questionAnswers: questionAnswers,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY", () => {
        const state: TestState = {
            ...defaultState,
            targetNavigationKey: "oldKey",
        };

        const actualState = reducer(state, {
            type: "DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY",
            payload: "newKey",
        });

        const expectedState = {
            ...defaultState,
            targetNavigationKey: "newKey",
        };

        expect(actualState).toEqual(expectedState);
    });
});
