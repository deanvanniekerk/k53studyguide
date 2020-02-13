import { createSelector, OutputSelector, Selector } from "reselect";
import { ContentData, NavigationData } from "src/data";
import { RootState } from "src/state/rootReducer";

import { contentDataSelector } from "../content";
import { navigationDataSelector } from "../navigation";
import { NavigationTreeItem, SeenContentKeys, SeenTotal, SeenTotals } from "./";
import { LogState } from "./reducer";

const rootSelector: Selector<RootState, LogState> = (state: RootState): LogState => state.study.log;
export const seenContentKeysSelector: OutputSelector<
    RootState,
    SeenContentKeys,
    (state: LogState) => SeenContentKeys
> = createSelector(rootSelector, root => root.seenContentKeys);

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
        key: "nav",
        children: [],
    };

    walk(root);

    return root;
});

export const seenTotalsSelector: OutputSelector<
    RootState,
    SeenTotals,
    (seenContentKeys: SeenContentKeys, navigationTree: NavigationTreeItem) => SeenTotals
> = createSelector(
    seenContentKeysSelector,
    navigationTreeSelector,
    (seenContentKeys, navigationTree) => {
        const totals: SeenTotals = {};

        const walk = (node: NavigationTreeItem): SeenTotal => {
            const isleaf = node.children.length === 0;

            const total: SeenTotal = {
                seen: isleaf && seenContentKeys[node.key] ? 1 : 0,
                total: isleaf ? 1 : 0,
            };

            node.children.forEach(child => {
                const childTotal = walk(child);
                total.seen += childTotal.seen;
                total.total += childTotal.total;
            });

            totals[node.key] = total;

            return total;
        };

        walk(navigationTree);

        return totals;
    }
);
