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
import { targetNavigationKeySelector } from "../navigation";
import {
    maxQuestionsSelector,
    questionAnswersSelector,
    recieveQuestionAnswers,
    RecieveQuestionAnswersAction,
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
        const maxQuestions = maxQuestionsSelector(getState());
        const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(
            getState()
        );

        let bank: QuestionItem[] = [];
        const keys = Object.keys(questionData);

        keys.forEach(k => {
            if (k.startsWith(targetKey)) bank.push(...questionData[k]);
        });

        //Upfront shuffle
        bank = shuffleArray<QuestionItem>(bank);

        //Now order - unanswered first then answered by date asc
        bank.sort((itemA: QuestionItem, itemB: QuestionItem) => {
            const minDate = new Date(0);

            const dateA = quesionsSuccesfullyAnsweredDates[itemA.id] || minDate;
            const dateB = quesionsSuccesfullyAnsweredDates[itemB.id] || minDate;

            if (dateA < dateB) return -1;

            if (dateA > dateB) return 1;

            return 0;
        });

        if (bank.length > maxQuestions) {
            bank = bank.slice(0, maxQuestions);
        }

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

        const dateAnswered = new Date();

        questionAnswers.forEach(qa => {
            if (qa.answer === qa.question.answer)
                dispatch(recieveQuesionSuccesfullyAnsweredDate(qa.question.id, dateAnswered));
        });
    };
};
