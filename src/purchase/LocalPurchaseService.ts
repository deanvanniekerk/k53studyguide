import { Store } from "redux";

import { PurchaseService } from "./types";

export class LocalPurchaseService implements PurchaseService {
    private _reduxStore: Store;

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    registerProduct() {
        console.log("LocalPurchaseService > registering product");
    }
}
