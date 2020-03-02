import { ThunkAction } from "redux-thunk";

import { QuestionItem } from "@/data";
import { RootState } from "@/state";
import { questionDataSelector } from "@/state/questions";
import { shuffleArray } from "@/utils";

import { recieveQuestionAnswers, RecieveQuestionAnswersAction } from "./";
import { QuestionAnswer, TestSection } from "./types";

export const loadQuestionAnswers = (): ThunkAction<
    void,
    RootState,
    null,
    RecieveQuestionAnswersAction
> => {
    return (dispatch, getState) => {
        const questionData = questionDataSelector(getState());

        const keys = Object.keys(questionData);

        let sectionABank: QuestionItem[] = [];
        let sectionBBank: QuestionItem[] = [];
        let sectionCBank: QuestionItem[] = [];

        keys.forEach(k => {
            if (k.startsWith("nav.vehicleControls")) sectionABank.push(...questionData[k]);
            else if (
                k.startsWith("nav.rulesOfTheRoad") ||
                k.startsWith("nav.defensiveDriving") ||
                k.startsWith("nav.roadSignals")
            )
                sectionBBank.push(...questionData[k]);
            else sectionCBank.push(...questionData[k]);
        });

        //Upfront shuffle
        sectionABank = shuffleArray<QuestionItem>(sectionABank);
        sectionBBank = shuffleArray<QuestionItem>(sectionBBank);
        sectionCBank = shuffleArray<QuestionItem>(sectionCBank);

        sectionABank = sectionABank.slice(0, Math.min(8, sectionABank.length));
        sectionBBank = sectionBBank.slice(0, Math.min(28, sectionBBank.length));
        sectionCBank = sectionCBank.slice(0, Math.min(28, sectionCBank.length));

        const questionAnswers: QuestionAnswer[] = [];

        const load = (section: TestSection, bank: QuestionItem[]) => {
            const qas: QuestionAnswer[] = bank.map(q => ({
                section: section,
                answer: null,
                question: q,
            }));
            questionAnswers.push(...qas);
        };

        load("A", sectionABank);
        load("B", sectionBBank);
        load("C", sectionCBank);

        dispatch(recieveQuestionAnswers(questionAnswers));
    };
};

// export const submitTest = (): ThunkAction<
//     void,
//     RootState,
//     null,
//     RecieveQuesionSuccesfullyAnsweredDateAction | RecieveExperienceGainedAction
// > => {
//     return (dispatch, getState) => {
//         const questionAnswers = questionAnswersSelector(getState());
//         const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(
//             getState()
//         );

//         let experienceGained = 0;
//         questionAnswers.forEach(qa => {
//             if (
//                 qa.answer === qa.question.answer &&
//                 !quesionsSuccesfullyAnsweredDates[qa.question.id]
//             )
//                 experienceGained++;
//         });
//         dispatch(recieveExperienceGained(experienceGained));

//         const dateAnswered = new Date();

//         questionAnswers.forEach(qa => {
//             if (qa.answer === qa.question.answer)
//                 dispatch(recieveQuesionSuccesfullyAnsweredDate(qa.question.id, dateAnswered));
//         });
//     };
// };
