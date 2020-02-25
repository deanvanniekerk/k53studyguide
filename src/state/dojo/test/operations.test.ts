import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { QuestionData, QuestionItem } from "@/data";

import {
    loadQuestionAnswers,
    recieveExperienceGained,
    recieveQuestionAnswers,
    submitTest,
} from "./";
import { QuestionAnswer } from "./types";

const middlewares = [thunk];
const mockStore = createMockStore(middlewares);

describe("state > dojo > test > operations", () => {
    const questions: QuestionItem[] = Array.from(new Array(10), (q, n) => ({
        id: `${n}`,
        answer: "B",
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

    const questionData: QuestionData = {
        "root.child1": [questions[0], questions[1]],
        "root.child2": [questions[2]],
        "root.child3.child1": [questions[3], questions[4], questions[5], questions[6]],
        "root.child4": [questions[7], questions[8], questions[9]],
    };

    it("loadQuestionAnswers - less than max", () => {
        const store = mockStore({
            questions: {
                questionData: questionData,
            },
            dojo: {
                test: {
                    targetNavigationKey: "root.child1",
                },
            },
        });

        store.dispatch(loadQuestionAnswers());

        const actions = store.getActions();

        expect(actions.length).toEqual(1);

        const questionAnswers: QuestionAnswer[] = [
            {
                answer: null,
                question: questions[0],
            },
            {
                answer: null,
                question: questions[1],
            },
        ];

        expect(actions[0].type).toEqual(recieveQuestionAnswers(questionAnswers).type);
        expect(actions[0].payload.length).toEqual(
            recieveQuestionAnswers(questionAnswers).payload.length
        );
        expect(actions[0].payload).toEqual(
            jasmine.arrayContaining(recieveQuestionAnswers(questionAnswers).payload)
        );
    });

    it("submitTest - 1 experience gained", () => {
        const answeredQuestions: QuestionAnswer[] = [
            {
                answer: "Z",
                question: questions[2],
            },
            {
                answer: questions[0].answer,
                question: questions[0],
            },
            {
                answer: "X",
                question: questions[1],
            },
        ];

        const store = mockStore({
            dojo: {
                log: {
                    quesionsSuccesfullyAnsweredDates: {},
                },
                test: {
                    questionAnswers: answeredQuestions,
                },
            },
        });

        const spy = jest.spyOn(global, "Date");

        store.dispatch(submitTest());

        const actions = store.getActions();

        expect(actions.length).toEqual(2);

        expect(actions[0]).toEqual(recieveExperienceGained(1));

        expect(actions[1].payload.questionId).toEqual(questions[0].id);

        const date = spy.mock.instances[0];
        expect(actions[1].payload.date).toEqual(date);
    });

    it("submitTest - 0 experience gained", () => {
        const answeredQuestions: QuestionAnswer[] = [
            {
                answer: "Z",
                question: questions[2],
            },
            {
                answer: questions[0].answer,
                question: questions[0],
            },
            {
                answer: "X",
                question: questions[1],
            },
        ];

        const store = mockStore({
            dojo: {
                log: {
                    quesionsSuccesfullyAnsweredDates: {
                        [questions[0].id]: new Date(),
                    },
                },
                test: {
                    questionAnswers: answeredQuestions,
                },
            },
        });

        const spy = jest.spyOn(global, "Date");

        store.dispatch(submitTest());

        const actions = store.getActions();

        expect(actions.length).toEqual(2);

        expect(actions[0]).toEqual(recieveExperienceGained(0));

        expect(actions[1].payload.questionId).toEqual(questions[0].id);

        const date = spy.mock.instances[0];
        expect(actions[1].payload.date).toEqual(date);
    });
});
