import { Store } from "redux";

import {
    recievePurchaseOwned,
    recievePurchaseProduct,
    recievePurchaseStatus,
} from "@/state/purchase";

import { PurchaseService } from "./types";

export class LocalPurchaseService implements PurchaseService {
    private readonly _reduxStore: Store;

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    initialize() {
        console.log("LocalPurchaseService > initialize product");

        //Dispatch Status
        const statusAction = recievePurchaseStatus(true, "valid");
        this._reduxStore.dispatch(statusAction);

        //Dispatch Product
        const productAction = recievePurchaseProduct(
            "R25",
            "K53 Ninja - Full Access",
            "Gives you full Access to all K53 Ninja Content"
        );
        this._reduxStore.dispatch(productAction);
    }

    //in app purchase flow: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md
    purchase() {
        console.log("LocalPurchaseService > purchase");

        let statusAction = recievePurchaseStatus(false, "requested");
        this._reduxStore.dispatch(statusAction);

        statusAction = recievePurchaseStatus(false, "initiated");
        this._reduxStore.dispatch(statusAction);

        //Add delay to simulate comms with server
        setTimeout(() => {
            statusAction = recievePurchaseStatus(false, "approved");
            this._reduxStore.dispatch(statusAction);

            //Dispatch Owned
            const ownedAction = recievePurchaseOwned(true);
            this._reduxStore.dispatch(ownedAction);

            statusAction = recievePurchaseStatus(false, "finished");
            this._reduxStore.dispatch(statusAction);

            statusAction = recievePurchaseStatus(true, "owned");
            this._reduxStore.dispatch(statusAction);
        }, 2000);
    }
}
