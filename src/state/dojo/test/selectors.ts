import { RootState } from '@/state/rootReducer';
import { createSelector, OutputSelector, Selector } from 'reselect';
import { QuestionAnswer } from './';
import { TestState } from './reducer';

const rootSelector: Selector<RootState, TestState> = (state: RootState): TestState => state.dojo.test;

export const questionAnswersSelector: OutputSelector<
  RootState,
  QuestionAnswer[],
  (state: TestState) => QuestionAnswer[]
> = createSelector(rootSelector, (root) => root.questionAnswers);

export const totalQuestionsSelector: OutputSelector<
  RootState,
  number,
  (questionAnswers: QuestionAnswer[]) => number
> = createSelector(questionAnswersSelector, (questionAnswers) => questionAnswers.length);

export const allQuestionsAnsweredSelector: OutputSelector<
  RootState,
  boolean,
  (questionAnswers: QuestionAnswer[]) => boolean
> = createSelector(questionAnswersSelector, (questionAnswers) => {
  return !questionAnswers.some((q) => !q.answer);
});

export const totalCorrectAnswersSelector: OutputSelector<
  RootState,
  number,
  (questionAnswers: QuestionAnswer[]) => number
> = createSelector(
  questionAnswersSelector,
  (questionAnswers) => questionAnswers.filter((qa) => qa.answer === qa.question.answer).length,
);

export const maxQuestionsSelector: OutputSelector<RootState, number, (state: TestState) => number> = createSelector(
  rootSelector,
  (root) => root.maxQuestions,
);

export const testInProgressSelector: OutputSelector<
  RootState,
  boolean,
  (totalQuestions: number) => boolean
> = createSelector(totalQuestionsSelector, (totalQuestions) => totalQuestions > 0);

export const experienceGainedSelector: OutputSelector<RootState, number, (state: TestState) => number> = createSelector(
  rootSelector,
  (root) => root.experienceGained,
);
