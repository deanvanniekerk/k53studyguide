import { createSelector, OutputSelector, Selector } from "reselect";
import { ContentData } from "src/data";
import { RootState } from "src/state/rootReducer";

import { ContentState } from "./reducer";

const rootSelector: Selector<RootState, ContentState> = (state: RootState): ContentState =>
    state.content;

export const contentDataSelector: OutputSelector<
    RootState,
    ContentData,
    (state: ContentState) => ContentData
> = createSelector(rootSelector, root => root.contentData);
