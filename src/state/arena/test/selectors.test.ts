import { deepClone } from "@/utils";

import { TestState } from "./";
import * as selectors from "./selectors";

describe("state > arena > test > selectors", () => {
    //Setup Data --------------------------------------------
    const questionAnswers = [
        {
            section: "1",
            answer: "A",
            question: {
                id: "1",
                answer: "C",
                text: "Question 1:",
                option: [
                    {
                        id: "A",
                        value: "Answer 1.",
                    },
                    {
                        id: "B",
                        value: "Answer 2.",
                    },
                    {
                        id: "C",
                        value: "Answer 3.",
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

    it("totalQuestionsSelector", () => {
        const actual = selectors.totalQuestionsSelector.resultFunc(questionAnswers);

        expect(actual).toEqual(1);
    });

    it("totalQuestionsSelector > true", () => {
        const data = deepClone([...questionAnswers, ...questionAnswers]);

        const actual = selectors.allQuestionsAnsweredSelector.resultFunc(data);

        expect(actual).toEqual(true);
    });

    it("totalQuestionsSelector > false", () => {
        const data = deepClone([...questionAnswers, ...questionAnswers]);

        data[0].answer = "";

        const actual = selectors.allQuestionsAnsweredSelector.resultFunc(data);

        expect(actual).toEqual(false);
    });

    it("totalCorrectAnswersSelector", () => {
        const data = deepClone([...questionAnswers, ...questionAnswers]);

        data[0].answer = "Z";
        data[1].answer = data[1].question.answer;

        const actual = selectors.totalCorrectAnswersSelector.resultFunc(data);

        expect(actual).toEqual(1);
    });

    it("testInProgressSelector > true", () => {
        const actual = selectors.testInProgressSelector.resultFunc(5);

        expect(actual).toEqual(true);
    });

    it("testInProgressSelector > false", () => {
        const actual = selectors.testInProgressSelector.resultFunc(0);

        expect(actual).toEqual(false);
    });
});
