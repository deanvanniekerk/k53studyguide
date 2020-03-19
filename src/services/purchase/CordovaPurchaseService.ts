import { Store } from "redux";

//import { v4 as uuidv4 } from "uuid";
import { recieveLogMessage } from "@/state/log";
import {
    recievePurchaseOrderStatus,
    recievePurchaseOwned,
    recievePurchaseProduct,
    recievePurchaseStatus,
} from "@/state/purchase";
import { IAPError, IAPProduct, InAppPurchase2 } from "@ionic-native/in-app-purchase-2";

import { LogData, LogLevel } from "../";
import { PurchaseService } from "./types";

//InApp Purchase: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md
export class CordovaPurchaseService implements PurchaseService {
    private readonly _reduxStore: Store;
    private readonly _productId = "premium_access";
    constructor(reduxStore: Store) {
        this._reduxStore = reduxStore;
    }

    async initialize() {
        this.log("DEBUG", "CordovaPurchaseService > initialize");

        InAppPurchase2.verbosity = InAppPurchase2.DEBUG;

        //Register
        InAppPurchase2.register({
            id: this._productId,
            type: InAppPurchase2.NON_CONSUMABLE,
        });

        //Subscribe to any additional changes
        InAppPurchase2.when(this._productId).updated((product: IAPProduct) => {
            this.log("DEBUG", "CordovaPurchaseService > product changed", {
                product: JSON.stringify(product, null, 4),
            });

            //Dispatch Status
            const statusAction = recievePurchaseStatus(product.canPurchase, product.state);
            this._reduxStore.dispatch(statusAction);
        });

        InAppPurchase2.when(this._productId).registered((product: IAPProduct) => {
            this.log("DEBUG", "CordovaPurchaseService > Product Registered");
            const productAction = recievePurchaseProduct(
                product.price,
                product.title,
                product.description
            );
            this._reduxStore.dispatch(productAction);
        });

        InAppPurchase2.when(this._productId).initiated(() => {
            this.log("DEBUG", "CordovaPurchaseService > Product Initiated");
            const statusAction = recievePurchaseOrderStatus("ready");
            this._reduxStore.dispatch(statusAction);
        });

        InAppPurchase2.when(this._productId).error((error: IAPError) => {
            this.log("DEBUG", "CordovaPurchaseService > Product Error : " + error.message);
            const statusAction = recievePurchaseOrderStatus("failed");
            this._reduxStore.dispatch(statusAction);
        });

        InAppPurchase2.when(this._productId).cancelled(() => {
            this.log("DEBUG", "CordovaPurchaseService > Product Cancelled");
            const statusAction = recievePurchaseOrderStatus("cancelled");
            this._reduxStore.dispatch(statusAction);
        });

        InAppPurchase2.when(this._productId).approved((product: IAPProduct) => {
            this.log("DEBUG", "CordovaPurchaseService > Product Approved");
            //Tell store purchase is successfull
            product.finish();
        });

        InAppPurchase2.when(this._productId).owned(() => {
            this.log("DEBUG", "CordovaPurchaseService > Product Owned");
            const ownedAction = recievePurchaseOwned(true);
            this._reduxStore.dispatch(ownedAction);
        });

        InAppPurchase2.when(this._productId).refunded(() => {
            this.log("DEBUG", "CordovaPurchaseService > Product Refunded");
            const statusAction = recievePurchaseOrderStatus("refunded");
            this._reduxStore.dispatch(statusAction);

            const ownedAction = recievePurchaseOwned(false);
            this._reduxStore.dispatch(ownedAction);
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

    log(level: LogLevel, message: string, data?: LogData) {
        const action = recieveLogMessage(level, message, data);

        this._reduxStore.dispatch(action);
    }
}
