import { Store } from "redux";

import { recievePurchaseStatus } from "@/state/purchase";

import { PurchaseService } from "./types";

export class LocalPurchaseService implements PurchaseService {
    private _reduxStore: Store;

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    initialize() {
        console.log("LocalPurchaseService > registering product");
    }

    purchase() {
        console.log("LocalPurchaseService > purchase");

        const action = recievePurchaseStatus(
            true,
            false,
            new Date(),
            "PURCHASE",
            "R25",
            "title",
            "description"
        );

        this._reduxStore.dispatch(action);
    }
}
