import { createSelector, OutputSelector, Selector } from "reselect";

import { QuestionData } from "@/data";
import { RootState } from "@/state/rootReducer";

import { QuestionState } from "./reducer";

const rootSelector: Selector<RootState, QuestionState> = (state: RootState): QuestionState =>
    state.questions;

export const questionDataSelector: OutputSelector<
    RootState,
    QuestionData,
    (state: QuestionState) => QuestionData
> = createSelector(rootSelector, root => root.questionData);
