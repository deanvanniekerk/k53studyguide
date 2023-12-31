import {
  recievePurchaseOrderState,
  recievePurchaseProduct,
  recievePurchaseProductCanPurchase,
  recievePurchaseProductOwned,
} from '@/state/purchase';
import { Store } from 'redux';
import { PurchaseService } from './types';

export class LocalPurchaseService implements PurchaseService {
  private readonly _reduxStore: Store;

  constructor(reduxStore: Store) {
    this._reduxStore = reduxStore;
  }

  initialize() {
    console.log('LocalPurchaseService > initialize product');

    //Dispatch Status
    const canPurchaseAction = recievePurchaseProductCanPurchase(true); //Test purchase
    this._reduxStore.dispatch(canPurchaseAction);

    // Already purchased
    // const canPurchaseAction = recievePurchaseProductCanPurchase(false);
    // this._reduxStore.dispatch(canPurchaseAction);
    // const ownedAction = recievePurchaseProductOwned(true);
    // this._reduxStore.dispatch(ownedAction);

    //Dispatch Product
    const productAction = recievePurchaseProduct(
      'R25',
      'K53 Ninja - Full Access',
      'Gives you full Access to all K53 Ninja Content',
    );
    this._reduxStore.dispatch(productAction);
  }

  //in app purchase flow: https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md
  purchase() {
    console.log('LocalPurchaseService > purchase');

    let statusAction = recievePurchaseOrderState('pending');
    this._reduxStore.dispatch(statusAction);

    //Add delay to simulate comms with server
    setTimeout(() => {
      statusAction = recievePurchaseOrderState('approved');
      this._reduxStore.dispatch(statusAction);

      statusAction = recievePurchaseOrderState('finished');
      this._reduxStore.dispatch(statusAction);

      const canPurchaseAction = recievePurchaseProductCanPurchase(false);
      this._reduxStore.dispatch(canPurchaseAction);

      const ownedAction = recievePurchaseProductOwned(true);
      this._reduxStore.dispatch(ownedAction);
    }, 1000);
  }
}
