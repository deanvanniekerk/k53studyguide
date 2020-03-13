export const PURCHASE_RECIEVE_STATUS = "PURCHASE_RECIEVE_STATUS";

export interface RecievePurchaseStatusAction {
    type: typeof PURCHASE_RECIEVE_STATUS;
    payload: {
        owned: boolean;
        canPurchase: boolean;
        expiryDate: Date | undefined;
        status: string;
        price: string;
        title: string;
        description: string;
    };
}

export type PuchaseActions = RecievePurchaseStatusAction;

export const recievePurchaseStatus = (
    owned: boolean,
    canPurchase: boolean,
    expiryDate: Date | undefined,
    status: string,
    price: string,
    title: string,
    description: string
): RecievePurchaseStatusAction => ({
    type: PURCHASE_RECIEVE_STATUS,
    payload: {
        owned,
        canPurchase,
        expiryDate,
        status,
        price,
        title,
        description,
    },
});
