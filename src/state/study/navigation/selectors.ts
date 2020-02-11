import { createSelector } from "reselect";

import { NavigationData, NavigationIcons } from "@/data";
import { RootState } from "@/state/rootReducer";

import { NavigationState } from "./reducer";

const rootSelector = (state: RootState): NavigationState => state.study.navigation;

export const navigationDataSelector: (state: RootState) => NavigationData = createSelector(
    rootSelector,
    root => root.navigationData
);

export const currentNavigationKeySelector: (state: RootState) => string = createSelector(
    rootSelector,
    root => root.currentNavigationKey
);

export const currentNavigationItemsSelector: (state: RootState) => string[] = createSelector(
    navigationDataSelector,
    currentNavigationKeySelector,
    (data, key) => data[key]
);

export const rootNavigationItemsSelector: (state: RootState) => string[] = createSelector(
    navigationDataSelector,
    data => data["nav"]
);

export const navigationIconsSelector: (state: RootState) => NavigationIcons = createSelector(
    rootSelector,
    root => root.navigationIcons
);
