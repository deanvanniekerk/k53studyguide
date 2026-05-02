import { createSelector, type Selector } from "reselect";
import type { ContentData } from "@/data";
import type { RootState } from "@/state/rootReducer";

type OutputSelector<State, Result, Combiner> = Selector<State, Result> & {
  resultFunc: Combiner;
};

import type { ContentState } from "./reducer";

const rootSelector: Selector<RootState, ContentState> = (state: RootState): ContentState => state.content;

export const contentDataSelector: OutputSelector<RootState, ContentData, (state: ContentState) => ContentData> =
  createSelector(rootSelector, (root) => root.contentData);
