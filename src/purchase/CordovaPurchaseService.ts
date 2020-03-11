import { Store } from "redux";

import { PurchaseService } from "./types";

export class CordovaPurchaseService implements PurchaseService {
    private _reduxStore: Store;
    private _productId = "premium_1_year";

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    registerProduct() {
        store.register({
            id: this._productId,
            alias: "1 Year Premium Subscription",
            type: store.NON_RENEWING_SUBSCRIPTION,
        });
        this.refresh();

        //Load product (price etc)
        //store.get(...)
        //  dispatch to redux
        //      price, name, owned, expiry

        store.when(this._productId).updated(this.listener);
    }

    refresh() {
        store.refresh();
    }

    listener(product: store.StoreProduct) {
        //Logging?
        //dispatch productUpdated... product.id, product.state, product.owned etc

        if (product.state === store.APPROVED) {
            //  dispatch to redux
            //      owned, expiry
            product.finish();
        }
    }
}
