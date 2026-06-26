import type { AnyAction, Store } from "redux";

export type PurchaseStore = Store<unknown, AnyAction>;

export interface PurchaseServiceConstructor {
  new (reduxStore: PurchaseStore): PurchaseService;
}

export interface PurchaseService {
  initialize: () => void;
  purchase: () => void;
  restore: () => void | Promise<void>;
}
