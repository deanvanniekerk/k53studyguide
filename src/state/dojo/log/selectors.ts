import { createSelector, OutputSelector, Selector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { QuesionsSuccesfullyAnsweredDates } from "./";
import { LogState } from "./reducer";

const rootSelector: Selector<RootState, LogState> = (state: RootState): LogState => state.dojo.log;

export const quesionsSuccesfullyAnsweredDatesSelector: OutputSelector<
    RootState,
    QuesionsSuccesfullyAnsweredDates,
    (state: LogState) => QuesionsSuccesfullyAnsweredDates
> = createSelector(rootSelector, root => root.quesionsSuccesfullyAnsweredDates);
