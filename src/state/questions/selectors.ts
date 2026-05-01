import { createSelector, type Selector } from "reselect";
import type { QuestionData } from "@/data";
import type { RootState } from "@/state/rootReducer";

type OutputSelector<State, Result, Combiner> = Selector<State, Result> & {
  resultFunc: Combiner;
};

import type { QuestionState } from "./reducer";

const rootSelector: Selector<RootState, QuestionState> = (state: RootState): QuestionState => state.questions;

export const questionDataSelector: OutputSelector<RootState, QuestionData, (state: QuestionState) => QuestionData> =
  createSelector(rootSelector, (root) => root.questionData);
