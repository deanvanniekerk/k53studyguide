import { createSelector, type Selector } from "reselect";
import type { RootState } from "@/state/rootReducer";

type OutputSelector<State, Result, Combiner> = Selector<State, Result> & {
  resultFunc: Combiner;
};

import type { LogState, QuesionsSuccesfullyAnsweredDates } from "./";

const rootSelector: Selector<RootState, LogState> = (state: RootState): LogState => state.arena.log;

export const quesionsSuccesfullyAnsweredDatesSelector: OutputSelector<
  RootState,
  QuesionsSuccesfullyAnsweredDates,
  (state: LogState) => QuesionsSuccesfullyAnsweredDates
> = createSelector(rootSelector, (root) => root.quesionsSuccesfullyAnsweredDates);

export const testsPassedSelector: OutputSelector<RootState, number, (state: LogState) => number> = createSelector(
  rootSelector,
  (root) => root.testsPassed,
);
