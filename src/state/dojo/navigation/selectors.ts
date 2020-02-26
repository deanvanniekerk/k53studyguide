import { createSelector, OutputSelector, Selector } from "reselect";

import { NavigationData } from "@/data";
import { navigationDataSelector } from "@/state/navigation";
import { RootState } from "@/state/rootReducer";
import { navigationKeyToBreadcrumb } from "@/utils";

import { NavigationState } from "./reducer";

const rootSelector: Selector<RootState, NavigationState> = (state: RootState): NavigationState =>
    state.dojo.navigation;

export const targetNavigationKeySelector: OutputSelector<
    RootState,
    string | null,
    (state: NavigationState) => string | null
> = createSelector(rootSelector, root => root.targetNavigationKey);

export const targetNavigationChildrenSelector: OutputSelector<
    RootState,
    string[],
    (data: NavigationData, key: string) => string[]
> = createSelector(navigationDataSelector, targetNavigationKeySelector, (data, key) =>
    key && data[key] ? data[key] : []
);

export const targetNavigationParentSelector: OutputSelector<
    RootState,
    string,
    (key: string) => string
> = createSelector(targetNavigationKeySelector, key => {
    const breadcrumb = navigationKeyToBreadcrumb(key);

    if (breadcrumb.length <= 1) return breadcrumb[0];

    return breadcrumb[breadcrumb.length - 2];
});
