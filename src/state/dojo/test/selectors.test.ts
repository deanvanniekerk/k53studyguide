import { TestState } from "./";
import * as selectors from "./selectors";

describe("state > study > navigation > selectors", () => {
    //Setup Data --------------------------------------------
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

    const defaultState: TestState = {
        questionAnswers: questionAnswers,
    };
    //-----------------------------------------------------------

    it("questionAnswersSelector", () => {
        const actual = selectors.questionAnswersSelector.resultFunc(defaultState);

        expect(actual).toEqual(questionAnswers);
    });
});
