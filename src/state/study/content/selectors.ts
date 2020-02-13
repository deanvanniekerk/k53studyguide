import { createSelector, OutputSelector, Selector } from "reselect";
import { ContentData, ContentItem } from "src/data";
import { RootState } from "src/state/rootReducer";

import { currentNavigationKeySelector } from "../navigation";
import { ContentState } from "./reducer";

const rootSelector: Selector<RootState, ContentState> = (state: RootState): ContentState =>
    state.study.content;

export const contentDataSelector: OutputSelector<
    RootState,
    ContentData,
    (state: ContentState) => ContentData
> = createSelector(rootSelector, root => root.contentData);

export const currentContentItemsSelector: OutputSelector<
    RootState,
    ContentItem[],
    (data: ContentData, key: string) => ContentItem[]
> = createSelector(contentDataSelector, currentNavigationKeySelector, (data, key) =>
    data[key] ? data[key] : []
);
