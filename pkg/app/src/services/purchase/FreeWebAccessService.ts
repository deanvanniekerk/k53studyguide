import {
  recievePurchaseAvailability,
  recievePurchaseProductCanPurchase,
  recievePurchaseProductOwned,
} from "@/state/purchase";
import type { PurchaseService, PurchaseStore } from "./types";

/** Feature access on web never confers a mobile Premium entitlement. */
export class FreeWebAccessService implements PurchaseService {
  readonly productId = "";
  constructor(private readonly store: PurchaseStore) {}

  initialize() {
    this.store.dispatch(recievePurchaseProductOwned(false));
    this.store.dispatch(recievePurchaseProductCanPurchase(false));
    this.store.dispatch(recievePurchaseAvailability("idle"));
  }
  offerOpened() {
    return () => {};
  }
  purchase() {
    console.warn("Purchases are not available with free web access.");
  }
  restore() {
    console.warn("Restore purchases in the mobile app.");
  }
}
