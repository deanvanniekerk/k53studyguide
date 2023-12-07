import { PurchaseState, reducer } from './reducer';

describe('state > purchase > reducer', () => {
  const defaultState: PurchaseState = {
    canPurchase: false,
    productState: 'initiated',
    orderState: 'ready',
    price: '',
    title: '',
    description: '',
  };

  it('should handle PURCHASE_RECIEVE_STATUS', () => {
    const actualState = reducer(defaultState, {
      type: 'PURCHASE_RECIEVE_PRODUCT_STATE',
      payload: {
        canPurchase: true,
        productState: 'owned',
      },
    });

    const expectedState = {
      ...defaultState,
      canPurchase: true,
      productState: 'owned',
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
