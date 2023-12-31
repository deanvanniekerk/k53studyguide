//import { v4 as uuidv4 } from "uuid";
import { recieveLogMessage } from '@/state/log';
import {
  recievePurchaseOrderState,
  recievePurchaseProduct,
  recievePurchaseProductCanPurchase,
  recievePurchaseProductOwned,
} from '@/state/purchase';
import 'cordova-plugin-purchase/www/store';
import { Store } from 'redux';
import { LogData, LogLevel } from '..';
import { PurchaseService } from './types';

//InApp Purchase: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md

// try: https://github.com/danielsogl/awesome-cordova-plugins/issues/4457#issuecomment-1825177796

export class CordovaPurchaseService implements PurchaseService {
  private readonly _reduxStore: Store;
  // private readonly _productId = 'premium_access';
  private readonly _productId = 'premium_access_test';
  constructor(reduxStore: Store) {
    this._reduxStore = reduxStore;
  }

  async initialize() {
    document.addEventListener(
      'deviceready',
      async () => {
        const { store, ProductType, Platform, LogLevel } = window.CdvPurchase; // window is important

        this.log('INFO', 'CordovaPurchaseService > initialize', {
          productId: this._productId,
          type: ProductType.NON_CONSUMABLE,
        });

        store.verbosity = LogLevel.DEBUG;

        store.register([
          {
            id: this._productId,
            type: ProductType.NON_CONSUMABLE,
            platform: Platform.GOOGLE_PLAY,
          },
        ]);

        store
          .when()
          .productUpdated((product) => {
            this.log('INFO', 'CordovaPurchaseService > product changed', {
              product: JSON.stringify(product),
            });

            //Dispatch Status
            const canPurchaseAction = recievePurchaseProductCanPurchase(product.canPurchase);
            this._reduxStore.dispatch(canPurchaseAction);

            const ownedAction = recievePurchaseProductOwned(product.owned);
            this._reduxStore.dispatch(ownedAction);

            const productAction = recievePurchaseProduct(
              product.pricing?.price ?? '',
              product.title,
              product.description,
            );
            this._reduxStore.dispatch(productAction);
          })
          .pending(() => {
            this.log('INFO', 'CordovaPurchaseService > product pending');
            const stateAction = recievePurchaseOrderState('pending');
            this._reduxStore.dispatch(stateAction);
          })
          .approved((p) => {
            this.log('INFO', 'CordovaPurchaseService > product approved');
            const stateAction = recievePurchaseOrderState('approved');
            this._reduxStore.dispatch(stateAction);
            p.finish();
          })
          .finished(() => {
            this.log('INFO', 'CordovaPurchaseService > product finished');
            const stateAction = recievePurchaseOrderState('finished');
            this._reduxStore.dispatch(stateAction);

            const canPurchaseAction = recievePurchaseProductCanPurchase(false);
            this._reduxStore.dispatch(canPurchaseAction);

            const ownedAction = recievePurchaseProductOwned(true);
            this._reduxStore.dispatch(ownedAction);
          });

        store.initialize([Platform.GOOGLE_PLAY]);
      },
      false,
    );
  }

  async purchase() {
    const { store, ErrorCode } = window.CdvPurchase; // window is important

    const product = store.get(this._productId);

    if (!product) {
      this.log('ERROR', 'CordovaPurchaseService > ordering product > cant get product');
      return;
    }

    const offer = product.getOffer();

    if (!offer) {
      this.log('ERROR', 'CordovaPurchaseService > ordering product > cant get offer');
      return;
    }

    this.log('INFO', 'CordovaPurchaseService > ordering product');

    let stateAction = recievePurchaseOrderState('pending');
    this._reduxStore.dispatch(stateAction);

    const error = await store.order(offer);

    if (error) {
      this.log('ERROR', 'CordovaPurchaseService > purchase > error', {
        isError: error.isError ? 'true' : 'false',
        code: error.code.toString(),
        message: error.message,
      });
      stateAction = recievePurchaseOrderState(error.code === ErrorCode.PAYMENT_CANCELLED ? 'cancelled' : 'error');
      this._reduxStore.dispatch(stateAction);
    }
  }

  log(level: LogLevel, message: string, data?: LogData) {
    const action = recieveLogMessage(level, message, data);

    this._reduxStore.dispatch(action);
  }
}
