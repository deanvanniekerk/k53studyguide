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

type DispatchExts = ReturnType<typeof loadQuestionAnswers> | ReturnType<typeof submitTest>;

const middlewares = [thunk];
const mockStore = createMockStore<{}, (action: DispatchExts) => void>(middlewares);

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
                log: {
                    quesionsSuccesfullyAnsweredDates: {},
                },
                navigation: {
                    targetNavigationKey: "root.child1",
                },
                test: {
                    maxQuestions: 10,
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

        expect(actions[0].type).toEqual("DOJO_TEST_RECIEVE_QUESTION_ANSWERS");
        expect(actions[0].payload.length).toEqual(2);

        expect(actions[0].payload).toEqual(
            jasmine.arrayContaining(recieveQuestionAnswers(questionAnswers).payload)
        );
    });

    it("loadQuestionAnswers - ordering", () => {
        const store = mockStore({
            questions: {
                questionData: questionData,
            },
            dojo: {
                log: {
                    quesionsSuccesfullyAnsweredDates: {
                        [questions[9].id]: new Date(5000).toISOString(),
                        [questions[1].id]: new Date(6000).toISOString(),
                        [questions[0].id]: new Date(7000).toISOString(),
                        [questions[2].id]: new Date(8000).toISOString(),
                        [questions[5].id]: new Date(9000).toISOString(),
                    },
                },
                navigation: {
                    targetNavigationKey: "root",
                },
                test: {
                    maxQuestions: 10,
                },
            },
        });

        //Ordering should be
        //3 : 4 : 6 : 7 : 8  (first 5 any order as the dates are null)
        //9
        //1
        //0
        //2
        //5

        store.dispatch(loadQuestionAnswers());

        const actions = store.getActions();

        expect(actions.length).toEqual(1);

        //The random list
        const questionAnswers: QuestionAnswer[] = [
            {
                answer: null,
                question: questions[3],
            },
            {
                answer: null,
                question: questions[4],
            },
            {
                answer: null,
                question: questions[6],
            },
            {
                answer: null,
                question: questions[7],
            },
            {
                answer: null,
                question: questions[8],
            },
        ];

        expect(actions[0].type).toEqual("DOJO_TEST_RECIEVE_QUESTION_ANSWERS");
        expect(actions[0].payload.length).toEqual(10);

        //Any order
        expect(actions[0].payload).toEqual(
            jasmine.arrayContaining(recieveQuestionAnswers(questionAnswers).payload)
        );

        //Ordered
        expect(actions[0].payload[5].question.id).toEqual(questions[9].id);
        expect(actions[0].payload[6].question.id).toEqual(questions[1].id);
        expect(actions[0].payload[7].question.id).toEqual(questions[0].id);
        expect(actions[0].payload[8].question.id).toEqual(questions[2].id);
        expect(actions[0].payload[9].question.id).toEqual(questions[5].id);
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

        const now = new Date();
        //@ts-ignore
        const spy = jest.spyOn(global, "Date").mockImplementation(() => now);

        store.dispatch(submitTest());

        const actions = store.getActions();

        expect(actions.length).toEqual(2);

        expect(actions[0]).toEqual(recieveExperienceGained(1));

        expect(actions[1].payload.questionId).toEqual(questions[0].id);

        expect(actions[1].payload.date).toEqual(now.toISOString());

        spy.mockReset();
        spy.mockRestore();
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
                        [questions[0].id]: new Date().toISOString(),
                    },
                },
                test: {
                    questionAnswers: answeredQuestions,
                },
            },
        });

        const now = new Date();
        //@ts-ignore
        const spy = jest.spyOn(global, "Date").mockImplementation(() => now);

        store.dispatch(submitTest());

        const actions = store.getActions();

        expect(actions.length).toEqual(2);

        expect(actions[0]).toEqual(recieveExperienceGained(0));

        expect(actions[1].payload.questionId).toEqual(questions[0].id);

        expect(actions[1].payload.date).toEqual(now.toISOString());

        spy.mockReset();
        spy.mockRestore();
    });
});
