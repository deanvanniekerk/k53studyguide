import { Store } from "redux";
import { v4 as uuidv4 } from "uuid";

import { recieveLogMessage } from "@/state/log";
import {
    recievePurchaseOwned,
    recievePurchaseProduct,
    recievePurchaseStatus,
} from "@/state/purchase";
import { Device } from "@ionic-native/device";
import { IAPProduct, InAppPurchase2 } from "@ionic-native/in-app-purchase-2";

import { LogData, LogLevel } from "../";
import { insertEntity, query } from "../azureStorage";
import { PurchaseRecord, PurchaseService } from "./types";

export class CordovaPurchaseService implements PurchaseService {
    private readonly _reduxStore: Store;
    private readonly _tableName = "Purchases";
    private readonly _productId = "full_access_lifetime";
    private readonly _deviceId: string;

    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
        this._deviceId = Device.uuid;
    }

    initialize() {
        this.log("DEBUG", "CordovaPurchaseService > initialize");

        InAppPurchase2.verbosity = InAppPurchase2.DEBUG;

        //Register
        InAppPurchase2.register({
            id: this._productId,
            type: InAppPurchase2.NON_RENEWING_SUBSCRIPTION,
        });

        //Subscribe to any additional changes
        InAppPurchase2.when(this._productId).updated((product: IAPProduct) => {
            this.log("DEBUG", "CordovaPurchaseService > product changed", {
                product: JSON.stringify(product, null, 4),
            });

            //Product has been purchased, record it
            if (product.state === InAppPurchase2.APPROVED) {
                const now = new Date();
                const record: PurchaseRecord = {
                    PartitionKey: this._deviceId,
                    RowKey: uuidv4(),
                    Owned: true,
                    PurchaseDate: now.toISOString(),
                    Transaction: product.transaction ? JSON.stringify(product.transaction) : "",
                };
                insertEntity(this._tableName, record).then(success => {
                    if (!success) return;

                    //Dispatch Owned
                    const ownedAction = recievePurchaseOwned(true, now.toISOString());
                    this._reduxStore.dispatch(ownedAction);

                    //Tell store purchase is successfull
                    product.finish();
                });
            }

            //Dispatch Status
            const statusAction = recievePurchaseStatus(product.canPurchase, product.state);
            this._reduxStore.dispatch(statusAction);

            //Dispatch Product
            const productAction = recievePurchaseProduct(
                product.price,
                product.title,
                product.description
            );
            this._reduxStore.dispatch(productAction);
        });

        InAppPurchase2.error((error: unknown) => {
            this.log("ERROR", "CordovaPurchaseService > Error : " + JSON.stringify(error));
        });

        //Refresh
        InAppPurchase2.refresh();
    }

    purchase() {
        this.log("DEBUG", "CordovaPurchaseService > ordering product");
        InAppPurchase2.order(this._productId);
    }

    loadPurchase() {
        this.log("DEBUG", "CordovaPurchaseService > loading owned");

        const selectKeys = ["PartitionKey", "RowKey", "Owned", "PurchaseDate", "Transaction"];

        query<PurchaseRecord>(this._tableName, this._deviceId, selectKeys).then(records => {
            this.log("DEBUG", "CordovaPurchaseService > query response", {
                records: JSON.stringify(records),
            });

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

    log(level: LogLevel, message: string, data?: LogData) {
        const action = recieveLogMessage(level, message, data);

        this._reduxStore.dispatch(action);
    }
}
