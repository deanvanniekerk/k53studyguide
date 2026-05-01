import { createSelector, type Selector } from "reselect";
import type { RootState } from "@/state/rootReducer";

type OutputSelector<State, Result, Combiner> = Selector<State, Result> & {
  resultFunc: Combiner;
};

import type { PurchaseState } from "./reducer";

const rootSelector: Selector<RootState, PurchaseState> = (state: RootState): PurchaseState => state.purchase;

export const purchaseSelector: OutputSelector<RootState, PurchaseState, (state: PurchaseState) => PurchaseState> =
  createSelector(rootSelector, (root) => root);

export const ownedSelector: OutputSelector<RootState, boolean, (state: PurchaseState) => boolean> = createSelector(
  rootSelector,
  (root) => root.owned,
);

export const canPurchaseSelector: OutputSelector<RootState, boolean, (state: PurchaseState) => boolean> =
  createSelector(rootSelector, (root) => root.canPurchase);
