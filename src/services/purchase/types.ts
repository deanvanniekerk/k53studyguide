import { Store } from "redux";

export interface PurchaseServiceConstructor {
    new (reduxStore: Store): PurchaseService;
}

export interface PurchaseService {
    initialize: () => void;
    purchase: () => void;
}
