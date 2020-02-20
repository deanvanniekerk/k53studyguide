import { createSelector, OutputSelector, Selector } from "reselect";
import { NavigationData, NavigationIcons } from "@/data";
import { RootState } from "@/state/rootReducer";

import { NavigationState, ROOT_NAVIGATION_KEY } from "./reducer";

const rootSelector: Selector<RootState, NavigationState> = (state: RootState): NavigationState =>
    state.navigation;

export const navigationDataSelector: OutputSelector<
    RootState,
    NavigationData,
    (state: NavigationState) => NavigationData
> = createSelector(rootSelector, root => root.navigationData);

export const rootNavigationChildrenSelector: OutputSelector<
    RootState,
    string[],
    (data: NavigationData) => string[]
> = createSelector(navigationDataSelector, data => data[ROOT_NAVIGATION_KEY]);

export const navigationIconsSelector: OutputSelector<
    RootState,
    NavigationIcons,
    (state: NavigationState) => NavigationIcons
> = createSelector(rootSelector, root => root.navigationIcons);
