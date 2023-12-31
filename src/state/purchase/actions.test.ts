import * as actions from './actions';

describe('state > purchase > actions', () => {
  it('recievePurchaseProductCanPurchase', () => {
    const expectedAction = {
      type: 'PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE',
      payload: {
        canPurchase: true,
      },
    };

    expect(actions.recievePurchaseProductCanPurchase(true)).toEqual(expectedAction);
  });

  it('recievePurchaseProductOwned', () => {
    const expectedAction = {
      type: 'PURCHASE_RECIEVE_PRODUCT_OWNED',
      payload: {
        owned: true,
      },
    };

    expect(actions.recievePurchaseProductOwned(true)).toEqual(expectedAction);
  });

  it('recievePurchaseOrderState', () => {
    const expectedAction = {
      type: 'PURCHASE_RECIEVE_ORDER_STATE',
      payload: 'error',
    };

    expect(actions.recievePurchaseOrderState('error')).toEqual(expectedAction);
  });

  it('recievePurchaseProduct', () => {
    const expectedAction = {
      type: 'PURCHASE_RECIEVE_PRODUCT',
      payload: {
        title: 'title',
        description: 'description',
        price: 'R25',
      },
    };

    expect(actions.recievePurchaseProduct('R25', 'title', 'description')).toEqual(expectedAction);
  });
});
