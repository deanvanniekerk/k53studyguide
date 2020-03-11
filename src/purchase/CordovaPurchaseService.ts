import { Store } from "redux";

import { PurchaseService } from "./types";

export class CordovaPurchaseService implements PurchaseService {
    private _reduxStore: Store;

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    registerProduct() {
        store.register({
            id: "premium_1_year",
            alias: "1 Year Premium Subscription",
            type: store.NON_RENEWING_SUBSCRIPTION,
        });
    }
}
