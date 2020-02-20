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
