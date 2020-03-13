import { Store } from "redux";

import { PurchaseService, PurchaseServiceConstructor } from "./types";

const createPurchaseService = (
    ctor: PurchaseServiceConstructor,
    reduxStore: Store
): PurchaseService => {
    return new ctor(reduxStore);
};

export { createPurchaseService };
