import * as actions from "./actions";

describe("state > dojo > test > actions", () => {
    it("recieveQuestionAnswers", () => {
        const expectedAction = {
            type: "DOJO_TEST_RECIEVE_QUESTION_ANSWERS",
            payload: [
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
            ],
        };

        expect(actions.recieveQuestionAnswers(expectedAction.payload)).toEqual(expectedAction);
    });

    it("recieveTargetNavigationKey", () => {
        const expectedAction = {
            type: "DOJO_TEST_RECIEVE_TARGET_NAVIGATION_KEY",
            payload: "99",
        };

        expect(actions.recieveTargetNavigationKey("99")).toEqual(expectedAction);
    });

    it("recieveAnswer", () => {
        const expectedAction = {
            type: "DOJO_TEST_RECIEVE_ANSWER",
            payload: {
                questionId: "1",
                answer: "A",
            },
        };

        expect(actions.recieveAnswer("1", "A")).toEqual(expectedAction);
    });

    it("recieveMaxQuestions", () => {
        const expectedAction = {
            type: "DOJO_TEST_RECIEVE_MAX_QUESTIONS",
            payload: 99,
        };

        expect(actions.recieveMaxQuestions(99)).toEqual(expectedAction);
    });

    it("recieveExperienceGained", () => {
        const expectedAction = {
            type: "DOJO_TEST_RECIEVE_EXPERIENCE_GAINED",
            payload: 7,
        };

        expect(actions.recieveExperienceGained(7)).toEqual(expectedAction);
    });
});
