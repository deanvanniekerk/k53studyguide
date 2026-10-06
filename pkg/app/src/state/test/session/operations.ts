import type { ThunkAction } from "redux-thunk";
import type { QuestionItem } from "@/data";
import { analytics } from "@/services/analytics";
import type { RootState } from "@/state";
import { questionDataSelector } from "@/state/questions";
import { shuffleArray } from "@/utils";
import {
  type IncrementPassedTestsAction,
  incrementPassedTests,
  quesionsSuccesfullyAnsweredDatesSelector,
  type RecieveQuesionSuccesfullyAnsweredDateAction,
  recieveQuesionSuccesfullyAnsweredDate,
} from "../log";
import { passedSelector, questionAnswersSelector, type RecieveQuestionAnswersAction, recieveQuestionAnswers } from "./";
import { type RecieveCompletedAtAction, recieveCompletedAt } from "./actions";
import {
  sectionAPassedSelector,
  sectionBPassedSelector,
  sectionCPassedSelector,
  testResultsSelector,
  totalCorrectAnswersSelector,
} from "./selectors";
import type { QuestionAnswer, TestSection } from "./types";

export const loadQuestionAnswers = (): ThunkAction<void, RootState, null, RecieveQuestionAnswersAction> => {
  return (dispatch, getState) => {
    const questionData = questionDataSelector(getState());
    const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(getState());

    const keys = Object.keys(questionData);

    let sectionABank: QuestionItem[] = [];
    let sectionBBank: QuestionItem[] = [];
    let sectionCBank: QuestionItem[] = [];

    keys.forEach((k) => {
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

    load("A", sectionABank);
    load("B", sectionBBank);
    load("C", sectionCBank);

    dispatch(recieveQuestionAnswers(questionAnswers));
  };
};

export const submitTest = (): ThunkAction<
  void,
  RootState,
  null,
  RecieveQuesionSuccesfullyAnsweredDateAction | IncrementPassedTestsAction | RecieveCompletedAtAction
> => {
  return (dispatch, getState) => {
    if (getState().test.session.completedAt) return;
    const questionAnswers = questionAnswersSelector(getState());
    if (questionAnswers.length === 0 || questionAnswers.some((qa) => !qa.answer)) return;
    const passed = passedSelector(getState());

    dispatch(recieveCompletedAt(new Date().toISOString()));
    const results = testResultsSelector(getState());
    if (getState().test.session.completionAnalyticsVersion === 2)
      analytics.trackMockTestComplete({
        question_count: questionAnswers.length,
        correct_count: totalCorrectAnswersSelector(getState()),
        passed,
        section_a_correct: results.A.correct,
        section_a_total: results.A.total,
        section_a_passed: sectionAPassedSelector(getState()),
        section_b_correct: results.B.correct,
        section_b_total: results.B.total,
        section_b_passed: sectionBPassedSelector(getState()),
        section_c_correct: results.C.correct,
        section_c_total: results.C.total,
        section_c_passed: sectionCPassedSelector(getState()),
      });
    if (passed) dispatch(incrementPassedTests());

    const dateAnswered = new Date();

    questionAnswers.forEach((qa) => {
      if (qa.answer === qa.question.answer)
        dispatch(recieveQuesionSuccesfullyAnsweredDate(qa.question.id, dateAnswered.toISOString()));
    });
  };
};
