//import { v4 as uuidv4 } from "uuid";
import { analytics } from "@/services/analytics";
import { recieveLogMessage } from "@/state/log";
import {
  recievePurchaseOrderState,
  recievePurchaseProduct,
  recievePurchaseProductCanPurchase,
  recievePurchaseProductOwned,
} from "@/state/purchase";
import "cordova-plugin-purchase/www/store";
import type { LogData, LogLevel } from "..";
import { DEFAULT_PREMIUM_PRODUCT_ID, getPremiumProductIdForStorePlatform } from "./productIds";
import type { PurchaseService, PurchaseStore } from "./types";

// try: https://github.com/danielsogl/awesome-cordova-plugins/issues/4457#issuecomment-1825177796

export class CordovaPurchaseService implements PurchaseService {
  private readonly _reduxStore: PurchaseStore;
  private _productId = DEFAULT_PREMIUM_PRODUCT_ID;

  constructor(reduxStore: PurchaseStore) {
    this._reduxStore = reduxStore;
  }

  async initialize() {
    document.addEventListener(
      "deviceready",
      async () => {
        const { store, ProductType, LogLevel } = window.CdvPurchase; // window is important
        const platform = store.defaultPlatform();
        this._productId = getPremiumProductIdForStorePlatform(platform);

        this.log("INFO", "CordovaPurchaseService > initialize", {
          productId: this._productId,
          platform,
          type: ProductType.NON_CONSUMABLE,
        });

        store.verbosity = LogLevel.WARNING;

        store.register([
          {
            id: this._productId,
            type: ProductType.NON_CONSUMABLE,
            platform,
          },
        ]);

        store
          .when()
          .productUpdated((product) => {
            this.log("INFO", "CordovaPurchaseService > product changed", {
              productId: product.id,
              canPurchase: product.canPurchase ? "true" : "false",
              owned: product.owned ? "true" : "false",
              price: product.pricing?.price ?? "",
            });

            //Dispatch Status
            const canPurchaseAction = recievePurchaseProductCanPurchase(product.canPurchase);
            this._reduxStore.dispatch(canPurchaseAction);

            const ownedAction = recievePurchaseProductOwned(product.owned);
            this._reduxStore.dispatch(ownedAction);

            const productAction = recievePurchaseProduct(
              product.pricing?.price ?? "",
              product.title,
              product.description,
            );
            this._reduxStore.dispatch(productAction);
          })
          .pending(() => {
            this.log("INFO", "CordovaPurchaseService > product pending");
            analytics.trackPurchaseState("pending", this.getAnalyticsPurchaseParams());
            const stateAction = recievePurchaseOrderState("pending");
            this._reduxStore.dispatch(stateAction);
          })
          .approved((p) => {
            this.log("INFO", "CordovaPurchaseService > product approved");
            const stateAction = recievePurchaseOrderState("approved");
            this._reduxStore.dispatch(stateAction);
            p.finish();
          })
          .finished(() => {
            this.log("INFO", "CordovaPurchaseService > product finished");
            analytics.trackPurchaseState("finished", this.getAnalyticsPurchaseParams());
            const stateAction = recievePurchaseOrderState("finished");
            this._reduxStore.dispatch(stateAction);

            const canPurchaseAction = recievePurchaseProductCanPurchase(false);
            this._reduxStore.dispatch(canPurchaseAction);

            const ownedAction = recievePurchaseProductOwned(true);
            this._reduxStore.dispatch(ownedAction);
          });

        store.initialize([platform]);
      },
      false,
    );
  }

  async purchase() {
    const { store, ErrorCode } = window.CdvPurchase; // window is important

    const product = store.get(this._productId);

    if (!product) {
      this.log("ERROR", "CordovaPurchaseService > ordering product > cant get product");
      return;
    }

    const offer = product.getOffer();

    if (!offer) {
      this.log("ERROR", "CordovaPurchaseService > ordering product > cant get offer");
      return;
    }

    this.log("INFO", "CordovaPurchaseService > ordering product");
    analytics.trackBeginCheckout(this.getAnalyticsPurchaseParams());

    let stateAction = recievePurchaseOrderState("pending");
    this._reduxStore.dispatch(stateAction);

    const error = await store.order(offer);

    if (error) {
      this.log("ERROR", "CordovaPurchaseService > purchase > error", {
        isError: error.isError ? "true" : "false",
        code: error.code.toString(),
        message: error.message,
      });
      const orderState = error.code === ErrorCode.PAYMENT_CANCELLED ? "cancelled" : "error";
      analytics.trackPurchaseState(orderState, this.getAnalyticsPurchaseParams());
      stateAction = recievePurchaseOrderState(orderState);
      this._reduxStore.dispatch(stateAction);
    }
  }

  async restore() {
    const { store } = window.CdvPurchase; // window is important

    this.log("INFO", "CordovaPurchaseService > restoring purchases");
    this._reduxStore.dispatch(recievePurchaseOrderState("pending"));

    const error = await store.restorePurchases();

    if (error) {
      this.log("ERROR", "CordovaPurchaseService > restore > error", {
        isError: error.isError ? "true" : "false",
        code: error.code.toString(),
        message: error.message,
      });
      this._reduxStore.dispatch(recievePurchaseOrderState("error"));
      return;
    }

    const product = store.get(this._productId);

    if (store.owned(this._productId) || product?.owned) {
      this._reduxStore.dispatch(recievePurchaseProductCanPurchase(false));
      this._reduxStore.dispatch(recievePurchaseProductOwned(true));
      this._reduxStore.dispatch(recievePurchaseOrderState("ready"));
      return;
    }

    this.log("INFO", "CordovaPurchaseService > restore > no purchase restored", {
      productId: this._productId,
    });
    this._reduxStore.dispatch(recievePurchaseOrderState("error"));
  }

  log(level: LogLevel, message: string, data?: LogData) {
    const action = recieveLogMessage(level, message, data);

    this._reduxStore.dispatch(action);
  }

  private getAnalyticsPurchaseParams() {
    const product = window.CdvPurchase?.store?.get(this._productId);
    const price = product?.pricing?.price;
    const value = Number.parseFloat(price?.replace(/[^0-9.]/g, "") ?? "");

    return {
      product_id: this._productId,
      price,
      currency: product?.pricing?.currency ?? "ZAR",
      value: Number.isNaN(value) ? undefined : value,
    };
  }
}
