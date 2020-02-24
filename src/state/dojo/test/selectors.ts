import { createSelector, OutputSelector, Selector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { QuestionAnswer } from "./";
import { TestState } from "./reducer";

const rootSelector: Selector<RootState, TestState> = (state: RootState): TestState =>
    state.dojo.test;

export const questionAnswersSelector: OutputSelector<
    RootState,
    QuestionAnswer[],
    (state: TestState) => QuestionAnswer[]
> = createSelector(rootSelector, root => root.questionAnswers);

export const targetNavigationKeySelector: OutputSelector<
    RootState,
    string,
    (state: TestState) => string
> = createSelector(rootSelector, root => root.targetNavigationKey);

export const totalQuestionsSelector: OutputSelector<
    RootState,
    number,
    (questionAnswers: QuestionAnswer[]) => number
> = createSelector(questionAnswersSelector, questionAnswers => questionAnswers.length);

export const allQuestionsAnsweredSelector: OutputSelector<
    RootState,
    boolean,
    (questionAnswers: QuestionAnswer[]) => boolean
> = createSelector(questionAnswersSelector, questionAnswers => {
    return !questionAnswers.some(q => !q.answer);
});

export const totalCorrectAnswersSelector: OutputSelector<
    RootState,
    number,
    (questionAnswers: QuestionAnswer[]) => number
> = createSelector(
    questionAnswersSelector,
    questionAnswers => questionAnswers.filter(qa => qa.answer === qa.question.answer).length
);
