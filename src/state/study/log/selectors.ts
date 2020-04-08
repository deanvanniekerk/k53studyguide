import { createSelector, OutputSelector, Selector } from "reselect";

import { NavigationTreeItem, navigationTreeSelector } from "@/state/navigation";
import { RootState } from "@/state/rootReducer";

import { SeenContentKeys, SeenTotal, SeenTotals } from "./";
import { LogState } from "./reducer";

const rootSelector: Selector<RootState, LogState> = (state: RootState): LogState => state.study.log;

export const seenContentKeysSelector: OutputSelector<
    RootState,
    SeenContentKeys,
    (state: LogState) => SeenContentKeys
> = createSelector(rootSelector, (root) => root.seenContentKeys);

export const lastSeenParentContentKeySelector: OutputSelector<
    RootState,
    string,
    (state: LogState) => string
> = createSelector(rootSelector, (root) => root.lastSeenParentContentKey);

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

            node.children.forEach((child) => {
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
