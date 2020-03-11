import { PuchaseActions } from "./";

export type PurchaseState = {
    readonly owned: boolean;
    readonly canPurchase: boolean;
    readonly expiryDate: Date | null;
    readonly status: string;
    readonly price: string;
    readonly title: string;
    readonly description: string;
};

export const defaultState: PurchaseState = {
    owned: false,
    canPurchase: false,
    expiryDate: null,
    status: "",
    price: "",
    title: "",
    description: "",
};

export const reducer = (
    state: PurchaseState = defaultState,
    action: PuchaseActions
): PurchaseState => {
    switch (action.type) {
        case "PURCHASE_RECIEVE_STATUS":
            return {
                ...state,
                owned: action.payload.owned,
                canPurchase: action.payload.canPurchase,
                expiryDate: action.payload.expiryDate,
                status: action.payload.status,
                price: action.payload.price,
                title: action.payload.title,
                description: action.payload.description,
            };
        default:
            return state;
    }
};
