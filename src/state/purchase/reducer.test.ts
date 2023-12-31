import { PurchaseState, reducer } from './reducer';

describe('state > purchase > reducer', () => {
  const defaultState: PurchaseState = {
    canPurchase: false,
    owned: false,
    orderState: 'ready',
    price: '',
    title: '',
    description: '',
  };

  it('should handle PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE', () => {
    const actualState = reducer(defaultState, {
      type: 'PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE',
      payload: {
        canPurchase: true,
      },
    });

    const expectedState = {
      ...defaultState,
      canPurchase: true,
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should handle PURCHASE_RECIEVE_PRODUCT_OWNED', () => {
    const actualState = reducer(defaultState, {
      type: 'PURCHASE_RECIEVE_PRODUCT_OWNED',
      payload: {
        owned: true,
      },
    });

    const expectedState = {
      ...defaultState,
      owned: true,
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should handle PURCHASE_RECIEVE_ORDER_STATE', () => {
    const actualState = reducer(defaultState, {
      type: 'PURCHASE_RECIEVE_ORDER_STATE',
      payload: 'cancelled',
    });

    const expectedState = {
      ...defaultState,
      orderState: 'cancelled',
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should handle PURCHASE_RECIEVE_PRODUCT', () => {
    const actualState = reducer(defaultState, {
      type: 'PURCHASE_RECIEVE_PRODUCT',
      payload: {
        price: 'R25',
        title: 'title',
        description: 'description',
      },
    });

    const expectedState = {
      ...defaultState,
      price: 'R25',
      title: 'title',
      description: 'description',
    };

    expect(actualState).toEqual(expectedState);
  });
});
