import { createSelector, OutputSelector, Selector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { QuestionAnswer, TestResults } from "./";
import { TestState } from "./reducer";
import { TestResult, TestSection } from "./types";

const rootSelector: Selector<RootState, TestState> = (state: RootState): TestState =>
    state.arena.test;

export const questionAnswersSelector: OutputSelector<
    RootState,
    QuestionAnswer[],
    (state: TestState) => QuestionAnswer[]
> = createSelector(rootSelector, root => root.questionAnswers);

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

export const testInProgressSelector: OutputSelector<
    RootState,
    boolean,
    (totalQuestions: number) => boolean
> = createSelector(totalQuestionsSelector, totalQuestions => totalQuestions > 0);

export const testResultsSelector: OutputSelector<
    RootState,
    TestResults,
    (questionAnswers: QuestionAnswer[]) => TestResults
> = createSelector(questionAnswersSelector, questionAnswers => {
    let qas = questionAnswers.filter(q => q.section === "A");
    const sectionAResult: TestResult = {
        minimumPass: 7,
        total: qas.length,
        answered: qas.filter(q => q.answer !== null).length,
        correct: qas.filter(q => q.answer === q.question.answer).length,
    };

    qas = questionAnswers.filter(q => q.section === "B");
    const sectionBResult: TestResult = {
        minimumPass: 23,
        total: qas.length,
        answered: qas.filter(q => q.answer !== null).length,
        correct: qas.filter(q => q.answer === q.question.answer).length,
    };

    qas = questionAnswers.filter(q => q.section === "C");
    const sectionCResult: TestResult = {
        minimumPass: 24,
        total: qas.length,
        answered: qas.filter(q => q.answer !== null).length,
        correct: qas.filter(q => q.answer === q.question.answer).length,
    };

    const results: TestResults = {
        A: sectionAResult,
        B: sectionBResult,
        C: sectionCResult,
    };

    return results;
});

export const currentSectionSelector: OutputSelector<
    RootState,
    TestSection,
    (state: TestState) => TestSection
> = createSelector(rootSelector, root => root.currentSection);

export const currentSectionQuestionsSelector: OutputSelector<
    RootState,
    QuestionAnswer[],
    (questionAnswers: QuestionAnswer[], currentSection: TestSection) => QuestionAnswer[]
> = createSelector(
    questionAnswersSelector,
    currentSectionSelector,
    (questionAnswers, currentSection) => {
        return questionAnswers.filter(q => q.section === currentSection);
    }
);
