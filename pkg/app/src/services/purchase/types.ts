import type { AnyAction, Store } from "redux";

export type OfferOrigin = "profile" | "mock_test" | "quiz_home" | "quiz_results";

export type PurchaseStore = Store<unknown, AnyAction>;

export interface PurchaseServiceConstructor {
  new (reduxStore: PurchaseStore): PurchaseService;
}

export interface PurchaseService {
  readonly productId: string;
  initialize: () => void;
  offerOpened: (origin: OfferOrigin) => () => void;
  purchase: (origin?: OfferOrigin) => void;
  restore: (origin?: OfferOrigin) => void | Promise<void>;
}
