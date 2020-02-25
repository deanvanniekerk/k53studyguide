import { ThunkAction } from "redux-thunk";

import { QuestionItem } from "@/data";
import { RootState } from "@/state";
import { questionDataSelector } from "@/state/questions";
import { shuffleArray } from "@/utils";

import {
    quesionsSuccesfullyAnsweredDatesSelector,
    recieveQuesionSuccesfullyAnsweredDate,
    RecieveQuesionSuccesfullyAnsweredDateAction,
} from "../log";
import {
    questionAnswersSelector,
    recieveQuestionAnswers,
    RecieveQuestionAnswersAction,
    targetNavigationKeySelector,
} from "./";
import { recieveExperienceGained, RecieveExperienceGainedAction } from "./actions";
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

export const submitTest = (): ThunkAction<
    void,
    RootState,
    null,
    RecieveQuesionSuccesfullyAnsweredDateAction | RecieveExperienceGainedAction
> => {
    return (dispatch, getState) => {
        const questionAnswers = questionAnswersSelector(getState());
        const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(
            getState()
        );

        let experienceGained = 0;
        questionAnswers.forEach(qa => {
            if (
                qa.answer === qa.question.answer &&
                !quesionsSuccesfullyAnsweredDates[qa.question.id]
            )
                experienceGained++;
        });
        dispatch(recieveExperienceGained(experienceGained));

        questionAnswers.forEach(qa => {
            if (qa.answer === qa.question.answer)
                dispatch(recieveQuesionSuccesfullyAnsweredDate(qa.question.id, new Date()));
        });
    };
};
