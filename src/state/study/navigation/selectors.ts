import { createSelector, OutputSelector, Selector } from "reselect";
import { NavigationData, NavigationIcons } from "src/data";
import { RootState } from "src/state/rootReducer";
import { navigationKeyToBreadcrumb } from "src/utils";

import { NavigationState, ROOT_NAVIGATION_KEY } from "./reducer";

const rootSelector: Selector<RootState, NavigationState> = (state: RootState): NavigationState =>
    state.study.navigation;

export const navigationDataSelector: OutputSelector<
    RootState,
    NavigationData,
    (state: NavigationState) => NavigationData
> = createSelector(rootSelector, root => root.navigationData);

export const currentNavigationKeySelector: OutputSelector<
    RootState,
    string,
    (state: NavigationState) => string
> = createSelector(rootSelector, root => root.currentNavigationKey);

export const currentNavigationChildrenSelector: OutputSelector<
    RootState,
    string[],
    (data: NavigationData, key: string) => string[]
> = createSelector(navigationDataSelector, currentNavigationKeySelector, (data, key) =>
    data[key] ? data[key] : []
);

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

export const currentNavigationParentSelector: OutputSelector<
    RootState,
    string,
    (key: string) => string
> = createSelector(currentNavigationKeySelector, key => {
    const breadcrumb = navigationKeyToBreadcrumb(key);

    if (breadcrumb.length <= 1) return breadcrumb[0];

    return breadcrumb[breadcrumb.length - 2];
});
