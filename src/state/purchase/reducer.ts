import { PuchaseActions } from "./";

export type PurchaseState = {
    readonly owned: boolean;
    readonly purchaseDate: string | null;
    readonly canPurchase: boolean;
    readonly status: string;
    readonly price: string;
    readonly title: string;
    readonly description: string;
};

export const defaultState: PurchaseState = {
    owned: false,
    purchaseDate: null,
    canPurchase: false,
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
                canPurchase: action.payload.canPurchase,
                status: action.payload.status,
            };
        case "PURCHASE_RECIEVE_PRODUCT":
            return {
                ...state,
                price: action.payload.price,
                title: action.payload.title,
                description: action.payload.description,
            };
        case "PURCHASE_RECIEVE_OWNED":
            return {
                ...state,
                owned: action.payload.owned,
                purchaseDate: action.payload.purchaseDate,
            };
        default:
            return state;
    }
};
