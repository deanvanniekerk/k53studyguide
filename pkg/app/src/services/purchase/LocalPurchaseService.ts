import { v4 as uuid } from "uuid";
import { analytics } from "@/services/analytics";
import {
  recievePurchaseAvailability,
  recievePurchaseOrderState,
  recievePurchaseProduct,
  recievePurchaseProductCanPurchase,
  recievePurchaseProductOwned,
} from "@/state/purchase";
import { DEFAULT_PREMIUM_PRODUCT_ID } from "./productIds";
import type { OfferOrigin, PurchaseService, PurchaseStore } from "./types";

export class LocalPurchaseService implements PurchaseService {
  private readonly _reduxStore: PurchaseStore;
  private readonly _productId = DEFAULT_PREMIUM_PRODUCT_ID;

  constructor(reduxStore: PurchaseStore) {
    this._reduxStore = reduxStore;
  }

  get productId() {
    return this._productId;
  }

  initialize() {
    console.log("LocalPurchaseService > initialize product");

    this._reduxStore.dispatch(recievePurchaseAvailability("ready"));

    //Dispatch Status
    const canPurchaseAction = recievePurchaseProductCanPurchase(true); //Test purchase
    this._reduxStore.dispatch(canPurchaseAction);

    // Already purchased
    // const canPurchaseAction = recievePurchaseProductCanPurchase(false);
    // this._reduxStore.dispatch(canPurchaseAction);
    // const ownedAction = recievePurchaseProductOwned(true);
    // this._reduxStore.dispatch(ownedAction);

    //Dispatch Product
    const productAction = recievePurchaseProduct(
      "R25",
      "K53 Ninja - Full Access",
      "Gives you full Access to all K53 Ninja Content",
    );
    this._reduxStore.dispatch(productAction);
  }

  offerOpened(origin: OfferOrigin) {
    analytics.trackPromotionView({
      ...this.getAnalyticsPurchaseParams(),
      offer_origin: origin,
      offer_surface: "purchase_modal",
      availability: "available",
      eligibility: "eligible",
    });
    return () => {};
  }

  purchase(origin?: OfferOrigin) {
    const params = { ...this.getAnalyticsPurchaseParams(), attempt_id: uuid(), offer_origin: origin ?? "unknown" };
    console.log("LocalPurchaseService > purchase");

    analytics.trackBeginCheckout(params);

    let statusAction = recievePurchaseOrderState("pending");
    this._reduxStore.dispatch(statusAction);

    statusAction = recievePurchaseOrderState("approved");
    this._reduxStore.dispatch(statusAction);

    statusAction = recievePurchaseOrderState("finished");
    this._reduxStore.dispatch(statusAction);
    analytics.trackPurchaseState("finished", params);

    const canPurchaseAction = recievePurchaseProductCanPurchase(false);
    this._reduxStore.dispatch(canPurchaseAction);

    const ownedAction = recievePurchaseProductOwned(true);
    this._reduxStore.dispatch(ownedAction);
  }

  restore() {
    console.log("LocalPurchaseService > restore");

    let statusAction = recievePurchaseOrderState("pending");
    this._reduxStore.dispatch(statusAction);

    const canPurchaseAction = recievePurchaseProductCanPurchase(false);
    this._reduxStore.dispatch(canPurchaseAction);

    const ownedAction = recievePurchaseProductOwned(true);
    this._reduxStore.dispatch(ownedAction);

    statusAction = recievePurchaseOrderState("ready");
    this._reduxStore.dispatch(statusAction);
  }

  private getAnalyticsPurchaseParams() {
    return {
      execution_context: "local",
      transaction_environment: "sandbox" as const,
      product_id: this._productId,
      price: "R25",
      currency: "ZAR",
      value: 25,
    };
  }
}
