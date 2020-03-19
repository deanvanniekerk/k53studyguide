import { OrderState, ProductState } from "./";

export const PURCHASE_RECIEVE_PRODUCT_STATE = "PURCHASE_RECIEVE_PRODUCT_STATE";
export const PURCHASE_RECIEVE_ORDER_STATE = "PURCHASE_RECIEVE_ORDER_STATE";
export const PURCHASE_RECIEVE_PRODUCT = "PURCHASE_RECIEVE_PRODUCT";

export interface RecievePurchaseProductStateAction {
    type: typeof PURCHASE_RECIEVE_PRODUCT_STATE;
    payload: {
        canPurchase: boolean;
        productState: ProductState;
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
    | RecievePurchaseProductStateAction
    | RecievePurchaseProductAction
    | RecievePurchaseOrderStateAction;

export const recievePurchaseProductState = (
    canPurchase: boolean,
    productState: ProductState
): RecievePurchaseProductStateAction => ({
    type: PURCHASE_RECIEVE_PRODUCT_STATE,
    payload: {
        canPurchase,
        productState,
    },
});

export const recievePurchaseOrderState = (
    orderState: OrderState
): RecievePurchaseOrderStateAction => ({
    type: PURCHASE_RECIEVE_ORDER_STATE,
    payload: orderState,
});

export const recievePurchaseProduct = (
    price: string,
    title: string,
    description: string
): RecievePurchaseProductAction => ({
    type: PURCHASE_RECIEVE_PRODUCT,
    payload: {
        price,
        title,
        description,
    },
});
