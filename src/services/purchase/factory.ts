import type { PurchaseService, PurchaseServiceConstructor, PurchaseStore } from "./types";

const createPurchaseService = (ctor: PurchaseServiceConstructor, reduxStore: PurchaseStore): PurchaseService => {
  return new ctor(reduxStore);
};

export { createPurchaseService };
