import { ThunkAction } from "redux-thunk";

import { QuestionItem } from "@/data";
import { RootState } from "@/state";
import { questionDataSelector } from "@/state/questions";
import { shuffleArray } from "@/utils";

import {
    recieveQuestionAnswers,
    RecieveQuestionAnswersAction,
    targetNavigationKeySelector,
} from "./";
import { QuestionAnswer } from "./types";

export const loadQuestionAnswers = (): ThunkAction<
    void,
    RootState,
    null,
    RecieveQuestionAnswersAction
> => {
    return (dispatch, getState) => {
        const targetKey = targetNavigationKeySelector(getState());
        const questionData = questionDataSelector(getState());

        let bank: QuestionItem[] = [];
        const keys = Object.keys(questionData);

        keys.forEach(k => {
            if (k.startsWith(targetKey)) bank.push(...questionData[k]);
        });

        bank = shuffleArray<QuestionItem>(bank);

        //Do some ordering here...
        if (bank.length > 10) bank = bank.slice(0, 10);

        const questionAnswers: QuestionAnswer[] = bank.map(q => ({
            answer: null,
            question: q,
        }));

        dispatch(recieveQuestionAnswers(questionAnswers));
    };
};
