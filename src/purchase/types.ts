import { Store } from "redux";

export interface PurchaseServiceConstructor {
    new (reduxStore: Store): PurchaseService;
}

export interface PurchaseService {
    registerProduct: () => void;
}
