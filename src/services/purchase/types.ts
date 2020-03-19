import { Store } from "redux";

export interface PurchaseServiceConstructor {
    new (reduxStore: Store): PurchaseService;
}

export interface PurchaseService {
    initialize: () => void;
    purchase: () => void;
}

export type PurchaseRecord = {
    PartitionKey: string;
    RowKey: string;
    PurchaseDate: string;
    Owned: boolean;
    Transaction: string;
    Platform: string;
    DeviceModel: string;
    DeviceVersion: string;
    AppVersionNumber: string;
};
