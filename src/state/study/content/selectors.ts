import { createSelector } from "reselect";

import { ContentData, ContentItem } from "@/data";
import { RootState } from "@/state/rootReducer";

import { currentNavigationKeySelector } from "../navigation";
import { ContentState } from "./reducer";

const rootSelector = (state: RootState): ContentState => state.study.content;

export const contentDataSelector: (state: RootState) => ContentData = createSelector(
    rootSelector,
    root => root.contentData
);

export const currentContentItemsSelector: (
    state: RootState
) => ContentItem[] = createSelector(
    contentDataSelector,
    currentNavigationKeySelector,
    (data, key) => (data[key] ? data[key] : [])
);
