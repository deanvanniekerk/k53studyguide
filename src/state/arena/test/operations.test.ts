import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { QuestionData, QuestionItem } from "@/data";

import { incrementPassedTests } from "../log";
import { loadQuestionAnswers, recieveQuestionAnswers, submitTest } from "./";
import { QuestionAnswer, TestSection } from "./types";

type DispatchExts = ReturnType<typeof loadQuestionAnswers>;

const middlewares = [thunk];
const mockStore = createMockStore<{}, (action: DispatchExts) => void>(middlewares);

describe("state > arena > test > operations", () => {
    const questions: QuestionItem[] = Array.from(new Array(10), (_, n) => ({
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
        "nav.vehicleControls": [questions[0], questions[1]],
        "nav.rulesOfTheRoad": [questions[2]],
        "nav.rulesOfTheRoad.child1": [questions[3], questions[4], questions[5], questions[6]],
        "nav.roadMarkings": [questions[7], questions[8], questions[9]],
    };

    it("loadQuestionAnswers", () => {
        const store = mockStore({
            questions: {
                questionData: questionData,
            },
            arena: {
                test: { questionAnswers: [] },
            },
        });

        store.dispatch(loadQuestionAnswers());

        const actions = store.getActions();

        expect(actions.length).toEqual(1);

        const questionAnswers: QuestionAnswer[] = [
            {
                section: "A",
                answer: null,
                question: questions[0],
            },
            {
                section: "A",
                answer: null,
                question: questions[1],
            },
            {
                section: "B",
                answer: null,
                question: questions[2],
            },
            {
                section: "B",
                answer: null,
                question: questions[3],
            },
            {
                section: "B",
                answer: null,
                question: questions[4],
            },
            {
                section: "B",
                answer: null,
                question: questions[5],
            },
            {
                section: "B",
                answer: null,
                question: questions[6],
            },
            {
                section: "C",
                answer: null,
                question: questions[7],
            },
            {
                section: "C",
                answer: null,
                question: questions[8],
            },
            {
                section: "C",
                answer: null,
                question: questions[9],
            },
        ];

        expect(actions[0].type).toEqual("ARENA_TEST_RECIEVE_QUESTION_ANSWERS");
        expect(actions[0].payload.length).toEqual(10);

        expect(actions[0].payload).toEqual(
            jasmine.arrayContaining(recieveQuestionAnswers(questionAnswers).payload)
        );
    });

    it("submitTest", () => {
        const answeredQuestions: QuestionAnswer[] = [
            {
                section: "A",
                answer: "Z",
                question: questions[2],
            },
            {
                section: "A",
                answer: questions[0].answer,
                question: questions[0],
            },
        ];

        const store = mockStore({
            arena: {
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

        expect(actions.length).toEqual(1);

        expect(actions[0].payload.questionId).toEqual(questions[0].id);
        const date = spy.mock.instances[0];
        expect(actions[0].payload.date).toEqual(date);
    });

    it("submitTest > pass", () => {
        const getQuestionAnswer = (
            section: TestSection,
            question: QuestionItem
        ): QuestionAnswer => {
            return {
                section: section,
                answer: "A",
                question: question,
            };
        };

        const getQuestionAnswers = (section: TestSection, count: number): QuestionAnswer[] => {
            return Array.from(new Array(count), (_, n) => {
                const question = {
                    id: `${n}`,
                    answer: "A",
                    text: ``,
                    option: [],
                };

                return getQuestionAnswer(section, question);
            });
        };

        const answeredQuestions: QuestionAnswer[] = [
            ...getQuestionAnswers("A", 8),
            ...getQuestionAnswers("B", 28),
            ...getQuestionAnswers("C", 28),
        ];

        const store = mockStore({
            arena: {
                log: {
                    quesionsSuccesfullyAnsweredDates: {},
                },
                test: {
                    questionAnswers: answeredQuestions,
                },
            },
        });

        store.dispatch(submitTest());

        const actions = store.getActions();

        expect(actions.length).toEqual(1 + 8 + 28 + 28);

        expect(actions[0]).toEqual(incrementPassedTests());
    });
});
