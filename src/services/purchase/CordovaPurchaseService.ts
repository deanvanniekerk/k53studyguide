//import { v4 as uuidv4 } from "uuid";
import { recieveLogMessage } from '@/state/log';
import {
  ProductState,
  recievePurchaseOrderState,
  recievePurchaseProduct,
  recievePurchaseProductState,
} from '@/state/purchase';
import { IAPError, IAPProduct, InAppPurchase2 } from '@ionic-native/in-app-purchase-2';
import { Store } from 'redux';
import { LogData, LogLevel } from '../';
import { PurchaseService } from './types';

//InApp Purchase: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md
export class CordovaPurchaseService implements PurchaseService {
  private readonly _reduxStore: Store;
  private readonly _productId = 'premium_access';
  constructor(reduxStore: Store) {
    this._reduxStore = reduxStore;
  }

  async initialize() {
    this.log('INFO', 'CordovaPurchaseService > initialize');

    InAppPurchase2.verbosity = InAppPurchase2.DEBUG;

    //Register
    InAppPurchase2.register({
      id: this._productId,
      type: InAppPurchase2.NON_CONSUMABLE,
    });

    //Subscribe to any additional changes
    InAppPurchase2.when(this._productId).updated((product: IAPProduct) => {
      this.log('INFO', 'CordovaPurchaseService > product changed', {
        product: JSON.stringify(product),
      });

      //Dispatch Status
      const stateAction = recievePurchaseProductState(product.canPurchase, product.state as ProductState);
      this._reduxStore.dispatch(stateAction);

      const productAction = recievePurchaseProduct(product.price, product.title, product.description);
      this._reduxStore.dispatch(productAction);
    });

    // not firing...
    // InAppPurchase2.when(this._productId).registered((product: IAPProduct) => {
    //     this.log("INFO", "CordovaPurchaseService > Product Registered");
    //     const productAction = recievePurchaseProduct(
    //         JSON.stringify(product),
    //         product.title,
    //         product.description
    //     );
    //     this._reduxStore.dispatch(productAction);
    // });

    InAppPurchase2.when(this._productId).approved((product: IAPProduct) => {
      this.log('INFO', 'CordovaPurchaseService > Product Approved');
      product.finish();
    });

    InAppPurchase2.when(this._productId).error((error: IAPError) => {
      this.log('INFO', 'CordovaPurchaseService > Product Error : ' + error.message);
      const stateAction = recievePurchaseOrderState('failed');
      this._reduxStore.dispatch(stateAction);
    });

    InAppPurchase2.when(this._productId).cancelled(() => {
      this.log('INFO', 'CordovaPurchaseService > Product Cancelled');
      const stateAction = recievePurchaseOrderState('cancelled');
      this._reduxStore.dispatch(stateAction);
    });

    InAppPurchase2.when(this._productId).refunded(() => {
      this.log('INFO', 'CordovaPurchaseService > Product Refunded');
    });

    InAppPurchase2.error((error: unknown) => {
      this.log('ERROR', 'CordovaPurchaseService > Error : ' + JSON.stringify(error));
    });

    //Refresh
    InAppPurchase2.refresh();
  }

  purchase() {
    this.log('INFO', 'CordovaPurchaseService > ordering product');
    InAppPurchase2.order(this._productId);
  }

  log(level: LogLevel, message: string, data?: LogData) {
    const action = recieveLogMessage(level, message, data);

    this._reduxStore.dispatch(action);
  }
}
