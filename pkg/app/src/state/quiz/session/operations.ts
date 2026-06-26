import type { ThunkAction } from "redux-thunk";
import type { QuestionItem } from "@/data";
import type { RootState } from "@/state";
import { questionDataSelector } from "@/state/questions";
import { shuffleArray } from "@/utils";
import {
  quesionsSuccesfullyAnsweredDatesSelector,
  type RecieveQuesionSuccesfullyAnsweredDateAction,
  recieveQuesionSuccesfullyAnsweredDate,
} from "../log";
import { targetNavigationKeySelector } from "../navigation";
import {
  maxQuestionsSelector,
  questionAnswersSelector,
  type RecieveQuestionAnswersAction,
  recieveQuestionAnswers,
} from "./";
import {
  type RecieveCompletedAtAction,
  type RecieveExperienceGainedAction,
  recieveCompletedAt,
  recieveExperienceGained,
} from "./actions";
import type { QuestionAnswer } from "./types";

export const loadQuestionAnswers = (): ThunkAction<void, RootState, null, RecieveQuestionAnswersAction> => {
  return (dispatch, getState) => {
    const targetKey = targetNavigationKeySelector(getState());
    const questionData = questionDataSelector(getState());
    const maxQuestions = maxQuestionsSelector(getState());
    const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(getState());

    let bank: QuestionItem[] = [];
    const keys = Object.keys(questionData);

    keys.forEach((k) => {
      if (k.startsWith(targetKey)) bank.push(...questionData[k]);
    });

    //Upfront shuffle
    bank = shuffleArray<QuestionItem>(bank);

    //Now order - unanswered first then answered by date asc
    bank.sort((itemA: QuestionItem, itemB: QuestionItem) => {
      const minDate = new Date(0);

      const dateA = quesionsSuccesfullyAnsweredDates[itemA.id]
        ? new Date(quesionsSuccesfullyAnsweredDates[itemA.id])
        : minDate;
      const dateB = quesionsSuccesfullyAnsweredDates[itemB.id]
        ? new Date(quesionsSuccesfullyAnsweredDates[itemB.id])
        : minDate;

      if (dateA < dateB) return -1;

      if (dateA > dateB) return 1;

      return 0;
    });

    if (bank.length > maxQuestions) {
      bank = bank.slice(0, maxQuestions);
    }

    const questionAnswers: QuestionAnswer[] = bank.map((q) => ({
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
  RecieveQuesionSuccesfullyAnsweredDateAction | RecieveExperienceGainedAction | RecieveCompletedAtAction
> => {
  return (dispatch, getState) => {
    const questionAnswers = questionAnswersSelector(getState());
    const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(getState());
    const dateAnswered = new Date();

    let experienceGained = 0;
    questionAnswers.forEach((qa) => {
      if (qa.answer === qa.question.answer && !quesionsSuccesfullyAnsweredDates[qa.question.id]) experienceGained++;
    });
    dispatch(recieveExperienceGained(experienceGained));
    dispatch(recieveCompletedAt(dateAnswered.toISOString()));

    questionAnswers.forEach((qa) => {
      if (qa.answer === qa.question.answer)
        dispatch(recieveQuesionSuccesfullyAnsweredDate(qa.question.id, dateAnswered.toISOString()));
    });
  };
};
