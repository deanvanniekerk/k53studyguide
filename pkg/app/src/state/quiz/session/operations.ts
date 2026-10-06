import { buildQuizQuestionAnswers, completeQuizSession } from "@k53studyguide/shared/quiz";
import type { ThunkAction } from "redux-thunk";
import { analytics } from "@/services/analytics";
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
  completedAtSelector,
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

export const loadQuestionAnswers = (): ThunkAction<void, RootState, null, RecieveQuestionAnswersAction> => {
  return (dispatch, getState) => {
    const targetKey = targetNavigationKeySelector(getState());
    const questionData = questionDataSelector(getState());
    const maxQuestions = maxQuestionsSelector(getState());
    const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(getState());

    const questionAnswers = buildQuizQuestionAnswers({
      questionData,
      targetNavigationKey: targetKey,
      maxQuestions,
      successfullyAnsweredDates: quesionsSuccesfullyAnsweredDates,
      shuffle: shuffleArray,
    });

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
    if (completedAtSelector(getState())) return;
    const questionAnswers = questionAnswersSelector(getState());
    if (questionAnswers.length === 0 || questionAnswers.some((qa) => !qa.answer)) return;
    const quesionsSuccesfullyAnsweredDates = quesionsSuccesfullyAnsweredDatesSelector(getState());
    const completion = completeQuizSession({
      questionAnswers,
      successfullyAnsweredDates: quesionsSuccesfullyAnsweredDates,
    });

    dispatch(recieveExperienceGained(completion.experienceGained));
    dispatch(recieveCompletedAt(completion.completedAt));
    if (getState().quiz.session.completionAnalyticsVersion === 2)
      analytics.trackQuizComplete({
        question_count: questionAnswers.length,
        correct_count: questionAnswers.filter((qa) => qa.answer === qa.question.answer).length,
        experience_gained: completion.experienceGained,
      });
    questionAnswers.forEach((qa) => {
      if (qa.answer === qa.question.answer)
        dispatch(recieveQuesionSuccesfullyAnsweredDate(qa.question.id, completion.completedAt));
    });
  };
};
