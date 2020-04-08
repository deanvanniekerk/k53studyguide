import { createSelector, OutputSelector, Selector } from "reselect";
import { ContentData } from "@/data";
import { RootState } from "@/state/rootReducer";

import { ContentState } from "./reducer";

const rootSelector: Selector<RootState, ContentState> = (state: RootState): ContentState =>
    state.content;

export const contentDataSelector: OutputSelector<
    RootState,
    ContentData,
    (state: ContentState) => ContentData
> = createSelector(rootSelector, (root) => root.contentData);
