import { createSelector, OutputSelector, Selector } from "reselect";

import { NavigationData, NavigationIcons } from "@/data";
import { RootState } from "@/state/rootReducer";

import { NavigationState } from "./reducer";

const rootNavigationItemName = "nav";

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

export const currentNavigationItemsSelector: OutputSelector<
    RootState,
    string[],
    (data: NavigationData, key: string) => string[]
> = createSelector(navigationDataSelector, currentNavigationKeySelector, (data, key) =>
    data[key] ? data[key] : []
);

export const rootNavigationItemsSelector: OutputSelector<
    RootState,
    string[],
    (data: NavigationData) => string[]
> = createSelector(navigationDataSelector, data => data[rootNavigationItemName]);

export const navigationIconsSelector: OutputSelector<
    RootState,
    NavigationIcons,
    (state: NavigationState) => NavigationIcons
> = createSelector(rootSelector, root => root.navigationIcons);

export const currentNavigationBreadcrumbSelector: OutputSelector<
    RootState,
    string[],
    (data: NavigationData, key: string) => string[]
> = createSelector(navigationDataSelector, currentNavigationKeySelector, (data, key) => {
    let breadcrumb: string[] = [];

    const walk = (node: string, items: string[]) => {
        items.push(node);

        if (node === key) {
            breadcrumb = items;
            return;
        }

        const children = data[node];

        if (!children) return;

        children.forEach(c => walk(c, [...items]));
    };

    walk(rootNavigationItemName, []);

    return breadcrumb;
});
