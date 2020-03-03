import { QuestionItem } from "@/data";
import { deepClone } from "@/utils";

import { TestState } from "./";
import * as selectors from "./selectors";
import { TestResults } from "./types";

describe("state > arena > test > selectors", () => {
    //Setup Data --------------------------------------------
    const questions: QuestionItem[] = Array.from(new Array(10), (q, n) => ({
        id: `${n}`,
        answer: "A",
        text: `Question ${n}:`,
        option: [
            {
                id: "A",
                value: "Answer A.",
            },
            {
                id: "B",
                value: "Answer B.",
            },
        ],
    }));

    const defaultState: TestState = {
        currentSection: "A",
        questionAnswers: [
            {
                section: "A",
                answer: "A",
                question: questions[0],
            },
            {
                section: "A",
                answer: "A",
                question: questions[1],
            },
            {
                section: "B",
                answer: "A",
                question: questions[2],
            },
            {
                section: "B",
                answer: "A",
                question: questions[3],
            },
            {
                section: "B",
                answer: "A",
                question: questions[4],
            },
            {
                section: "C",
                answer: "A",
                question: questions[5],
            },
            {
                section: "C",
                answer: "A",
                question: questions[6],
            },
            {
                section: "C",
                answer: "A",
                question: questions[7],
            },
            {
                section: "C",
                answer: "A",
                question: questions[8],
            },
            {
                section: "C",
                answer: "A",
                question: questions[9],
            },
        ],
    };

    //-----------------------------------------------------------

    it("questionAnswersSelector", () => {
        const actual = selectors.questionAnswersSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.questionAnswers);
    });

    it("totalQuestionsSelector", () => {
        const actual = selectors.totalQuestionsSelector.resultFunc(defaultState.questionAnswers);

        expect(actual).toEqual(10);
    });

    it("totalQuestionsSelector > true", () => {
        const data = deepClone([...defaultState.questionAnswers, ...defaultState.questionAnswers]);

        const actual = selectors.allQuestionsAnsweredSelector.resultFunc(data);

        expect(actual).toEqual(true);
    });

    it("totalQuestionsSelector > false", () => {
        const data = deepClone([...defaultState.questionAnswers, ...defaultState.questionAnswers]);

        data[0].answer = "";

        const actual = selectors.allQuestionsAnsweredSelector.resultFunc(data);

        expect(actual).toEqual(false);
    });

    it("totalCorrectAnswersSelector", () => {
        const data = deepClone([...defaultState.questionAnswers, ...defaultState.questionAnswers]);

        data[0].answer = "B";
        data[1].answer = data[1].question.answer;

        const actual = selectors.totalCorrectAnswersSelector.resultFunc(data);

        expect(actual).toEqual(19);
    });

    it("testInProgressSelector > true", () => {
        const actual = selectors.testInProgressSelector.resultFunc(5);

        expect(actual).toEqual(true);
    });

    it("testInProgressSelector > false", () => {
        const actual = selectors.testInProgressSelector.resultFunc(0);

        expect(actual).toEqual(false);
    });

    it("testResultsSelector > false", () => {
        const data = deepClone([...defaultState.questionAnswers]);

        data[0].answer = "B";
        data[2].answer = "B";
        data[9].answer = "B";

        const actual = selectors.testResultsSelector.resultFunc(data);

        const expected: TestResults = {
            A: {
                correct: 1,
                total: 2,
                answered: 2,
                minimumPass: 7,
            },
            B: {
                correct: 2,
                total: 3,
                answered: 3,
                minimumPass: 23,
            },
            C: {
                correct: 4,
                total: 5,
                answered: 5,
                minimumPass: 24,
            },
        };

        expect(actual).toEqual(expected);
    });
});
