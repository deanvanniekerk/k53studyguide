import { RootState } from '@/state/rootReducer';
import { createSelector, OutputSelector, Selector } from 'reselect';
import { LogState, QuesionsSuccesfullyAnsweredDates } from './';

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
