import type { PuchaseActions } from "./";
import type { OrderState, StoreAvailability } from "./types";

export type PurchaseState = {
  readonly availability: StoreAvailability;
  readonly paymentPending: boolean;
  readonly canPurchase: boolean;
  readonly owned: boolean;
  readonly orderState: OrderState;
  readonly price: string;
  readonly title: string;
  readonly description: string;
};

export const defaultState: PurchaseState = {
  availability: "idle",
  paymentPending: false,
  canPurchase: false,
  owned: false,
  orderState: "ready",
  price: "",
  title: "",
  description: "",
};

export const reducer = (state: PurchaseState = defaultState, action: PuchaseActions): PurchaseState => {
  switch (action.type) {
    case "PURCHASE_RECIEVE_AVAILABILITY":
      return { ...state, availability: action.payload };
    case "PURCHASE_RECIEVE_PAYMENT_PENDING":
      return { ...state, paymentPending: action.payload };
    case "PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE":
      return {
        ...state,
        canPurchase: action.payload.canPurchase,
      };
    case "PURCHASE_RECIEVE_PRODUCT_OWNED":
      return {
        ...state,
        owned: action.payload.owned,
      };
    case "PURCHASE_RECIEVE_ORDER_STATE":
      return {
        ...state,
        orderState: action.payload,
      };
    case "PURCHASE_RECIEVE_PRODUCT":
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
