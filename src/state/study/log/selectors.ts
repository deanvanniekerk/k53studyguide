import { createSelector, OutputSelector, Selector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { SeenContent } from "../";
import { LogState } from "./reducer";

const rootSelector: Selector<RootState, LogState> = (state: RootState): LogState => state.study.log;
export const seenContentSelector: OutputSelector<
    RootState,
    SeenContent,
    (state: LogState) => SeenContent
> = createSelector(rootSelector, root => root.seenContent);
