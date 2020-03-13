import { Store } from "redux";

import { recievePurchaseStatus } from "@/state/purchase";

import { PurchaseService } from "./types";

export class CordovaPurchaseService implements PurchaseService {
    private _reduxStore: Store;
    private _productId = "full_access_lifetime";

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    initialize() {
        console.log("CordovaPurchaseService > initialize");

        //Register
        store.register({
            id: this._productId,
            alias: "K53 Ninja - Full Access",
            type: store.NON_RENEWING_SUBSCRIPTION,
        });

        console.log("CordovaPurchaseService > refresh");

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

        console.log("CordovaPurchaseService > product changed", JSON.stringify(product, null, 4));

        this._reduxStore.dispatch(action);
    }

    purchase() {
        console.log("CordovaPurchaseService > ordering product");

        store.order(this._productId);
    }
}
