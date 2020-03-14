import { Store } from "redux";

import { recieveLogMessage } from "@/state/log";
import { recievePurchaseStatus } from "@/state/purchase";
import { IAPProduct, InAppPurchase2 } from "@ionic-native/in-app-purchase-2";

import { LogData } from "../";
import { PurchaseService } from "./types";

export class CordovaPurchaseService implements PurchaseService {
    private _reduxStore: Store;
    private _productId = "full_access_lifetime";
    private _product: IAPProduct | null = null;

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    initialize() {
        this.log("CordovaPurchaseService > initialize");

        InAppPurchase2.verbosity = InAppPurchase2.DEBUG;

        InAppPurchase2.ready(() => {
            this.log("CordovaPurchaseService > ready");

            //Register
            InAppPurchase2.register({
                id: this._productId,
                type: InAppPurchase2.NON_RENEWING_SUBSCRIPTION,
            });

            //Subscribe to any additional changes
            InAppPurchase2.when(this._productId).updated(this.handleProductChange);

            //Refresh
            this.refresh();

            //Initial load of product
            this._product = InAppPurchase2.get(this._productId);
            this.handleProductChange(this._product);

            InAppPurchase2.when(this._product).approved((product: IAPProduct) => {
                this.log("CordovaPurchaseService > product approved");
                this.handleProductChange(product);
            });
        });

        InAppPurchase2.error((error: unknown) => {
            this.log("CordovaPurchaseService > Error");
            this.log("CordovaPurchaseService > Error : " + JSON.stringify(error));
        });
    }

    refresh() {
        InAppPurchase2.refresh();
    }

    handleProductChange(product: IAPProduct) {
        this.log("CordovaPurchaseService > product changed", {
            product: JSON.stringify(product, null, 4),
        });

        if (product.state === InAppPurchase2.APPROVED) {
            product.finish();
        }

        const action = recievePurchaseStatus(
            product.owned,
            product.canPurchase,
            product.expiryDate,
            product.state,
            product.price,
            product.title,
            product.description
        );

        this._reduxStore.dispatch(action);
    }

    purchase() {
        if (!this._product) return;

        this.log("CordovaPurchaseService > ordering product");

        InAppPurchase2.order(this._product);
    }

    log(message: string, data?: LogData) {
        const action = recieveLogMessage("DEBUG", message, data);

        this._reduxStore.dispatch(action);
    }
}
