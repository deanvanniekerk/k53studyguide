import { Store } from "redux";

export interface PurchaseServiceConstructor {
    new (reduxStore: Store): PurchaseService;
}

export interface PurchaseService {
    initialize: () => void;
    purchase: () => void;
    loadPurchase: () => void;
}

export type PurchaseRecord = {
    PartitionKey: string;
    RowKey: string;
    PurchaseDate: string;
    Owned: boolean;
    Transaction: string;
};
