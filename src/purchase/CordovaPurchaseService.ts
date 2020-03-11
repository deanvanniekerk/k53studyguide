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
        //Register
        store.register({
            id: this._productId,
            alias: "K53 Ninja - Full Access",
            type: store.NON_RENEWING_SUBSCRIPTION,
        });

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

        this._reduxStore.dispatch(action);
    }

    purchase() {
        store.order(this._productId);
    }
}
