import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { QuestionData, QuestionItem } from "@/data";

import { loadQuestionAnswers, recieveQuestionAnswers } from "./";
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

        expect(actions[0]).toEqual(recieveQuestionAnswers(questionAnswers));
    });
});
