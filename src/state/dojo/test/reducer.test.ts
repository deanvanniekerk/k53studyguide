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
                    answer: "B",
                    text: "Question 1:",
                    option: [
                        {
                            id: "A",
                            value: "Option 1.",
                        },
                        {
                            id: "B",
                            value: "Option 2.",
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

    it("should handle DOJO_TEST_RECIEVE_QUESTION_ANSWERS", () => {
        const questionAnswers = [
            {
                answer: "A",
                question: {
                    id: "4",
                    answer: "B",
                    text: "Question 1:",
                    option: [
                        {
                            id: "A",
                            value: "Option 1.",
                        },
                        {
                            id: "B",
                            value: "Option 2.",
                        },
                        {
                            id: "C",
                            value: "Option 3.",
                        },
                    ],
                },
            },
            {
                answer: null,
                question: {
                    id: "3",
                    answer: "B",
                    text: "Question 1:",
                    option: [
                        {
                            id: "A",
                            value: "Option 1.",
                        },
                        {
                            id: "B",
                            value: "Option 2.",
                        },
                        {
                            id: "C",
                            value: "Option 3.",
                        },
                    ],
                },
            },
            {
                answer: null,
                question: {
                    id: "2",
                    answer: "B",
                    text: "Question 1:",
                    option: [
                        {
                            id: "A",
                            value: "Option 1.",
                        },
                        {
                            id: "B",
                            value: "Option 2.",
                        },
                        {
                            id: "C",
                            value: "Option 3.",
                        },
                    ],
                },
            },
            {
                answer: "C",
                question: {
                    id: "1",
                    answer: "B",
                    text: "Question 1:",
                    option: [
                        {
                            id: "A",
                            value: "Option 1.",
                        },
                        {
                            id: "B",
                            value: "Option 2.",
                        },
                        {
                            id: "C",
                            value: "Option 3.",
                        },
                    ],
                },
            },
        ];

        const initalState = { ...defaultState, questionAnswers };

        const actualState = reducer(initalState, {
            type: "DOJO_TEST_RECIEVE_ANSWER",
            payload: {
                questionId: "2",
                answer: "B",
            },
        });

        //Deep clone
        const expectedState = JSON.parse(JSON.stringify(initalState));

        expectedState.questionAnswers[2].answer = "B";

        expect(actualState).toEqual(expectedState);
    });
});
