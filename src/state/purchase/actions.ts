import { OrderState } from './';

export const PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE = 'PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE';
export const PURCHASE_RECIEVE_PRODUCT_OWNED = 'PURCHASE_RECIEVE_PRODUCT_OWNED';
export const PURCHASE_RECIEVE_ORDER_STATE = 'PURCHASE_RECIEVE_ORDER_STATE';
export const PURCHASE_RECIEVE_PRODUCT = 'PURCHASE_RECIEVE_PRODUCT';

export interface RecievePurchaseProductCanPurchaseAction {
  type: typeof PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE;
  payload: {
    canPurchase: boolean;
  };
}

export interface RecievePurchaseProductOwnedAction {
  type: typeof PURCHASE_RECIEVE_PRODUCT_OWNED;
  payload: {
    owned: boolean;
  };
}

export interface RecievePurchaseOrderStateAction {
  type: typeof PURCHASE_RECIEVE_ORDER_STATE;
  payload: OrderState;
}

export interface RecievePurchaseProductAction {
  type: typeof PURCHASE_RECIEVE_PRODUCT;
  payload: {
    price: string;
    title: string;
    description: string;
  };
}

export type PuchaseActions =
  | RecievePurchaseProductCanPurchaseAction
  | RecievePurchaseProductOwnedAction
  | RecievePurchaseProductAction
  | RecievePurchaseOrderStateAction;

export const recievePurchaseProductCanPurchase = (canPurchase: boolean): RecievePurchaseProductCanPurchaseAction => ({
  type: PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE,
  payload: {
    canPurchase,
  },
});

export const recievePurchaseProductOwned = (owned: boolean): RecievePurchaseProductOwnedAction => ({
  type: PURCHASE_RECIEVE_PRODUCT_OWNED,
  payload: {
    owned,
  },
});

export const recievePurchaseOrderState = (orderState: OrderState): RecievePurchaseOrderStateAction => ({
  type: PURCHASE_RECIEVE_ORDER_STATE,
  payload: orderState,
});

export const recievePurchaseProduct = (
  price: string,
  title: string,
  description: string,
): RecievePurchaseProductAction => ({
  type: PURCHASE_RECIEVE_PRODUCT,
  payload: {
    price,
    title,
    description,
  },
});
