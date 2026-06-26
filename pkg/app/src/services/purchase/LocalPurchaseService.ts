import { analytics } from "@/services/analytics";
import {
  recievePurchaseOrderState,
  recievePurchaseProduct,
  recievePurchaseProductCanPurchase,
  recievePurchaseProductOwned,
} from "@/state/purchase";
import { DEFAULT_PREMIUM_PRODUCT_ID } from "./productIds";
import type { PurchaseService, PurchaseStore } from "./types";

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

  //in app purchase flow: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md
  purchase() {
    console.log("LocalPurchaseService > purchase");

    analytics.trackBeginCheckout(this.getAnalyticsPurchaseParams());

    let statusAction = recievePurchaseOrderState("pending");
    this._reduxStore.dispatch(statusAction);
    analytics.trackPurchaseState("pending", this.getAnalyticsPurchaseParams());

    //Add delay to simulate comms with server
    setTimeout(() => {
      statusAction = recievePurchaseOrderState("approved");
      this._reduxStore.dispatch(statusAction);

      statusAction = recievePurchaseOrderState("finished");
      this._reduxStore.dispatch(statusAction);
      analytics.trackPurchaseState("finished", this.getAnalyticsPurchaseParams());

      const canPurchaseAction = recievePurchaseProductCanPurchase(false);
      this._reduxStore.dispatch(canPurchaseAction);

      const ownedAction = recievePurchaseProductOwned(true);
      this._reduxStore.dispatch(ownedAction);
    }, 1000);
  }

  restore() {
    console.log("LocalPurchaseService > restore");

    let statusAction = recievePurchaseOrderState("pending");
    this._reduxStore.dispatch(statusAction);

    setTimeout(() => {
      const canPurchaseAction = recievePurchaseProductCanPurchase(false);
      this._reduxStore.dispatch(canPurchaseAction);

      const ownedAction = recievePurchaseProductOwned(true);
      this._reduxStore.dispatch(ownedAction);

      statusAction = recievePurchaseOrderState("ready");
      this._reduxStore.dispatch(statusAction);
    }, 1000);
  }

  private getAnalyticsPurchaseParams() {
    return {
      product_id: this._productId,
      price: "R25",
      currency: "ZAR",
      value: 25,
    };
  }
}
