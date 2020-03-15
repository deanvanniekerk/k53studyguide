export const PURCHASE_RECIEVE_STATUS = "PURCHASE_RECIEVE_STATUS";
export const PURCHASE_RECIEVE_PRODUCT = "PURCHASE_RECIEVE_PRODUCT";
export const PURCHASE_RECIEVE_OWNED = "PURCHASE_RECIEVE_OWNED";

export interface RecievePurchaseStatusAction {
    type: typeof PURCHASE_RECIEVE_STATUS;
    payload: {
        canPurchase: boolean;
        status: string;
    };
}

export interface RecievePurchaseProductAction {
    type: typeof PURCHASE_RECIEVE_PRODUCT;
    payload: {
        price: string;
        title: string;
        description: string;
    };
}

export interface RecievePurchaseOwnedAction {
    type: typeof PURCHASE_RECIEVE_OWNED;
    payload: {
        owned: boolean;
        purchaseDate: Date | null;
    };
}

export type PuchaseActions =
    | RecievePurchaseStatusAction
    | RecievePurchaseProductAction
    | RecievePurchaseOwnedAction;

export const recievePurchaseStatus = (
    canPurchase: boolean,
    status: string
): RecievePurchaseStatusAction => ({
    type: PURCHASE_RECIEVE_STATUS,
    payload: {
        canPurchase,
        status,
    },
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

export const recievePurchaseOwned = (
    owned: boolean,
    purchaseDate: Date | null
): RecievePurchaseOwnedAction => ({
    type: PURCHASE_RECIEVE_OWNED,
    payload: {
        owned,
        purchaseDate,
    },
});
