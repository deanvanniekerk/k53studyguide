import { QuestionItem } from '@/data';
import { RootState } from '@/state';
import { questionDataSelector } from '@/state/questions';
import { shuffleArray } from '@/utils';
import { ThunkAction } from 'redux-thunk';
import {
  incrementPassedTests,
  IncrementPassedTestsAction,
  quesionsSuccesfullyAnsweredDatesSelector,
  recieveQuesionSuccesfullyAnsweredDate,
  RecieveQuesionSuccesfullyAnsweredDateAction,
} from '../log';
import { passedSelector, questionAnswersSelector, recieveQuestionAnswers, RecieveQuestionAnswersAction } from './';
import { QuestionAnswer, TestSection } from './types';

export const loadQuestionAnswers = (): ThunkAction<void, RootState, null, RecieveQuestionAnswersAction> => {
  return (dispatch, getState) => {
    const questionData = questionDataSelector(getState());
    const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(getState());

    const keys = Object.keys(questionData);

    let sectionABank: QuestionItem[] = [];
    let sectionBBank: QuestionItem[] = [];
    let sectionCBank: QuestionItem[] = [];

    keys.forEach((k) => {
      if (k.startsWith('nav.vehicleControls')) sectionABank.push(...questionData[k]);
      else if (
        k.startsWith('nav.rulesOfTheRoad') ||
        k.startsWith('nav.defensiveDriving') ||
        k.startsWith('nav.roadSignals')
      )
        sectionBBank.push(...questionData[k]);
      else sectionCBank.push(...questionData[k]);
    });

    //Upfront shuffle
    sectionABank = shuffleArray<QuestionItem>(sectionABank);
    sectionBBank = shuffleArray<QuestionItem>(sectionBBank);
    sectionCBank = shuffleArray<QuestionItem>(sectionCBank);

    const sortByDate = (itemA: QuestionItem, itemB: QuestionItem) => {
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
    };

    //Now order - unanswered first then answered by date asc
    sectionABank.sort(sortByDate);
    sectionBBank.sort(sortByDate);
    sectionCBank.sort(sortByDate);

    sectionABank = sectionABank.slice(0, Math.min(8, sectionABank.length));
    sectionBBank = sectionBBank.slice(0, Math.min(28, sectionBBank.length));
    sectionCBank = sectionCBank.slice(0, Math.min(28, sectionCBank.length));

    const questionAnswers: QuestionAnswer[] = [];

    const load = (section: TestSection, bank: QuestionItem[]) => {
      const qas: QuestionAnswer[] = bank.map((q) => ({
        section: section,
        answer: null,
        question: q,
      }));
      questionAnswers.push(...qas);
    };

    load('A', sectionABank);
    load('B', sectionBBank);
    load('C', sectionCBank);

    dispatch(recieveQuestionAnswers(questionAnswers));
  };
};

export const submitTest = (): ThunkAction<
  void,
  RootState,
  null,
  RecieveQuesionSuccesfullyAnsweredDateAction | IncrementPassedTestsAction
> => {
  return (dispatch, getState) => {
    const questionAnswers = questionAnswersSelector(getState());
    const passed = passedSelector(getState());

    if (passed) dispatch(incrementPassedTests());

    const dateAnswered = new Date();

    questionAnswers.forEach((qa) => {
      if (qa.answer === qa.question.answer)
        dispatch(recieveQuesionSuccesfullyAnsweredDate(qa.question.id, dateAnswered.toISOString()));
    });
  };
};
