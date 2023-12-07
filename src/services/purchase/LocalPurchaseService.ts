import { recievePurchaseProduct, recievePurchaseProductState } from '@/state/purchase';
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
    const statusAction = recievePurchaseProductState(true, 'valid'); //Test purchase
    //const statusAction = recievePurchaseProductState(false, "owned"); //Already purchased
    this._reduxStore.dispatch(statusAction);

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

    let statusAction = recievePurchaseProductState(false, 'requested');
    this._reduxStore.dispatch(statusAction);

    statusAction = recievePurchaseProductState(false, 'initiated');
    this._reduxStore.dispatch(statusAction);

    //Add delay to simulate comms with server
    setTimeout(() => {
      statusAction = recievePurchaseProductState(false, 'approved');
      this._reduxStore.dispatch(statusAction);

      statusAction = recievePurchaseProductState(false, 'finished');
      this._reduxStore.dispatch(statusAction);

      statusAction = recievePurchaseProductState(false, 'owned');
      this._reduxStore.dispatch(statusAction);
    }, 1000);
  }
}
