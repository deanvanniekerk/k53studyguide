import { createSelector, OutputSelector, Selector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PurchaseState } from "./reducer";

const rootSelector: Selector<RootState, PurchaseState> = (state: RootState): PurchaseState =>
    state.purchase;

export const purchaseSelector: OutputSelector<
    RootState,
    PurchaseState,
    (state: PurchaseState) => PurchaseState
> = createSelector(rootSelector, (root) => root);

export const hasFullAccessSelector: OutputSelector<
    RootState,
    boolean,
    (state: PurchaseState) => boolean
> = createSelector(rootSelector, (root) => root.productState == "owned");

export const canPurchaseSelector: OutputSelector<
    RootState,
    boolean,
    (state: PurchaseState) => boolean
> = createSelector(rootSelector, (root) => root.canPurchase);
