import { createSelector, OutputSelector, Selector } from "reselect";

import { ContentData, NavigationData, NavigationIcons } from "@/data";
import { contentDataSelector } from "@/state/content";
import { RootState } from "@/state/rootReducer";

import { NavigationState, NavigationTreeItem, ROOT_NAVIGATION_KEY } from "./";

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

export const navigationTreeSelector: OutputSelector<
    RootState,
    NavigationTreeItem,
    (navData: NavigationData, contentData: ContentData) => NavigationTreeItem
> = createSelector(navigationDataSelector, contentDataSelector, (navData, contentData) => {
    const walk = (parent: NavigationTreeItem) => {
        const childrenKeys = navData[parent.key];

        if (childrenKeys) {
            childrenKeys.forEach(childrenKey => {
                const child: NavigationTreeItem = {
                    key: childrenKey,
                    children: [],
                };
                parent.children.push(child);

                walk(child);
            });
        }

        const childContent = contentData[parent.key];

        if (childContent) {
            childContent.forEach((contentItem, index) => {
                const child: NavigationTreeItem = {
                    key: `${parent.key}.${index + 1}`,
                    children: [],
                };
                parent.children.push(child);
            });
        }
    };

    const root: NavigationTreeItem = {
        key: ROOT_NAVIGATION_KEY,
        children: [],
    };

    walk(root);

    return root;
});
