// import { createSelector } from "reselect";

// import { NavigationData, NavigationIcons } from "@/data";
// import { RootState } from "@/state/rootReducer";

// import { NavigationState } from "./reducer";

// const rootNavigationItemName = "nav";

// const rootSelector = (state: RootState): NavigationState => state.study.navigation;

// export const navigationDataSelector: (state: RootState) => NavigationData = createSelector(
//     rootSelector,
//     root => root.navigationData
// );

// export const currentNavigationKeySelector: (state: RootState) => string = createSelector(
//     rootSelector,
//     root => root.currentNavigationKey
// );

// export const currentNavigationItemsSelector: (
//     state: RootState
// ) => string[] = createSelector(navigationDataSelector, currentNavigationKeySelector, (data, key) =>
//     data[key] ? data[key] : []
// );

// export const rootNavigationItemsSelector: (state: RootState) => string[] = createSelector(
//     navigationDataSelector,
//     data => data[rootNavigationItemName]
// );

// export const navigationIconsSelector: (state: RootState) => NavigationIcons = createSelector(
//     rootSelector,
//     root => root.navigationIcons
// );

// export const currentNavigationBreadcrumbSelector: (state: RootState) => string[] = createSelector(
//     navigationDataSelector,
//     currentNavigationKeySelector,
//     (data, key) => {
//         let breadcrumb: string[] = [];

//         const walk = (node: string, items: string[]) => {
//             items.push(node);

//             if (node === key) {
//                 breadcrumb = items;
//                 return;
//             }

//             const children = data[node];

//             if (!children) return;

//             children.forEach(c => walk(c, [...items]));
//         };

//         walk(rootNavigationItemName, []);

//         return breadcrumb;
//     }
// );
