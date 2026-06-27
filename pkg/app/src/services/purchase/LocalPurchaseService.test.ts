import type { AnyAction } from "redux";
import { analytics } from "@/services/analytics";
import { LocalPurchaseService } from "./LocalPurchaseService";
import type { PurchaseStore } from "./types";

vi.mock("@/services/analytics", () => ({
  analytics: {
    trackBeginCheckout: vi.fn(),
    trackPurchaseState: vi.fn(),
  },
}));

const createStore = (): PurchaseStore => {
  const actions: AnyAction[] = [];

  return {
    dispatch: vi.fn((action: AnyAction) => {
      actions.push(action);
      return action;
    }),
    getState: vi.fn(),
    replaceReducer: vi.fn(),
    subscribe: vi.fn(),
    actions,
  } as unknown as PurchaseStore;
};

describe("LocalPurchaseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("makes the mocked product purchasable in local web", () => {
    const store = createStore();

    new LocalPurchaseService(store).initialize();

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE",
      payload: { canPurchase: true },
    });
  });

  it("accepts local purchases immediately", () => {
    const store = createStore();

    new LocalPurchaseService(store).purchase();

    expect(analytics.trackPurchaseState).toHaveBeenCalledWith(
      "finished",
      expect.objectContaining({ product_id: "premium_access" }),
    );
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "PURCHASE_RECIEVE_ORDER_STATE",
      payload: "finished",
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "PURCHASE_RECIEVE_PRODUCT_OWNED",
      payload: { owned: true },
    });
  });

  it("accepts local restores immediately", () => {
    const store = createStore();

    new LocalPurchaseService(store).restore();

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "PURCHASE_RECIEVE_PRODUCT_OWNED",
      payload: { owned: true },
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "PURCHASE_RECIEVE_ORDER_STATE",
      payload: "ready",
    });
  });
});
