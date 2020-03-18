import { Store } from "redux";
import { v4 as uuidv4 } from "uuid";

import {
    recievePurchaseOwned,
    recievePurchaseProduct,
    recievePurchaseStatus,
} from "@/state/purchase";

import { insertEntity, query } from "../azureStorage";
import { PurchaseRecord, PurchaseService } from "./types";

export class LocalPurchaseService implements PurchaseService {
    private readonly _reduxStore: Store;
    private readonly _tableName = "Purchases";
    private readonly _deviceId = "no-device-id";

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

            const now = new Date();
            const record: PurchaseRecord = {
                PartitionKey: this._deviceId,
                RowKey: uuidv4(),
                Owned: true,
                PurchaseDate: now.toISOString(),
                Transaction: "Mock transaction data",
                Platform: "Local Web",
                AppVersionNumber: "?.?",
                DeviceModel: "",
                DeviceVersion: "",
            };
            insertEntity(this._tableName, record).then(success => {
                if (!success) return;

                //Dispatch Owned
                const ownedAction = recievePurchaseOwned(true, now.toISOString());
                this._reduxStore.dispatch(ownedAction);

                statusAction = recievePurchaseStatus(false, "finished");
                this._reduxStore.dispatch(statusAction);

                statusAction = recievePurchaseStatus(true, "valid");
                this._reduxStore.dispatch(statusAction);
            });
        }, 2000);
    }

    loadPurchase() {
        console.log("LocalPurchaseService > loadPurchase");

        const selectKeys = ["PartitionKey", "RowKey", "Owned", "PurchaseDate", "Transaction"];

        query<PurchaseRecord>(this._tableName, this._deviceId, selectKeys).then(records => {
            console.log("LocalPurchaseService > query response", records);

            if (records.length === 0) {
                //Dispatch Owned
                const ownedAction = recievePurchaseOwned(false, null);
                this._reduxStore.dispatch(ownedAction);
            } else {
                //Sort by purchase date
                const sorted = records.sort((a, b) => {
                    return +new Date(b.PurchaseDate) - +new Date(a.PurchaseDate);
                });

                const record = sorted[0];
                //Dispatch Owned
                const ownedAction = recievePurchaseOwned(record.Owned, record.PurchaseDate);

                this._reduxStore.dispatch(ownedAction);
            }
        });
    }
}
