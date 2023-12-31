import { PuchaseActions } from './';
import { OrderState } from './types';

export type PurchaseState = {
  readonly canPurchase: boolean;
  readonly owned: boolean;
  readonly orderState: OrderState;
  readonly price: string;
  readonly title: string;
  readonly description: string;
};

export const defaultState: PurchaseState = {
  canPurchase: false,
  owned: false,
  orderState: 'ready',
  price: '',
  title: '',
  description: '',
};

export const reducer = (state: PurchaseState = defaultState, action: PuchaseActions): PurchaseState => {
  switch (action.type) {
    case 'PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE':
      return {
        ...state,
        canPurchase: action.payload.canPurchase,
      };
    case 'PURCHASE_RECIEVE_PRODUCT_OWNED':
      return {
        ...state,
        owned: action.payload.owned,
      };
    case 'PURCHASE_RECIEVE_ORDER_STATE':
      return {
        ...state,
        orderState: action.payload,
      };
    case 'PURCHASE_RECIEVE_PRODUCT':
      return {
        ...state,
        price: action.payload.price,
        title: action.payload.title,
        description: action.payload.description,
      };
    default:
      return state;
  }
};
