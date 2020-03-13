import { Store } from "redux";

import { recieveLogMessage } from "@/state/log";
import { recievePurchaseStatus } from "@/state/purchase";

import { LogData } from "../";
import { PurchaseService } from "./types";

export class CordovaPurchaseService implements PurchaseService {
    private _reduxStore: Store;
    private _productId = "full_access_lifetime";

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    initialize() {
        this.log("CordovaPurchaseService > initialize");

        //Register
        store.register({
            id: this._productId,
            alias: "K53 Ninja - Full Access",
            type: store.NON_RENEWING_SUBSCRIPTION,
        });

        this.log("CordovaPurchaseService > refresh");

        //Refresh
        this.refresh();

        //Initial load of product
        const product = store.get(this._productId);
        this.handleProductChange(product);

        //Subscribe to any additional changes
        store.when(this._productId).updated(this.handleProductChange);
    }

    refresh() {
        store.refresh();
    }

    handleProductChange(product: store.StoreProduct) {
        this.log("CordovaPurchaseService > product changed", {
            product: JSON.stringify(product, null, 4),
        });

        if (product.state === store.APPROVED) {
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
        this.log("CordovaPurchaseService > ordering product");

        store.order(this._productId);
    }

    log(message: string, data?: LogData) {
        const action = recieveLogMessage("DEBUG", message, data);

        this._reduxStore.dispatch(action);
    }
}
