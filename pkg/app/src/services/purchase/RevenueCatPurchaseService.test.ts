import { Capacitor } from "@capacitor/core";
import { type CustomerInfo, Purchases, type PurchasesStoreProduct } from "@revenuecat/purchases-capacitor";
import type { AnyAction } from "redux";
import { RevenueCatPurchaseService } from "./RevenueCatPurchaseService";
import type { PurchaseStore } from "./types";

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    getPlatform: vi.fn(),
  },
}));

vi.mock("@revenuecat/purchases-capacitor", () => ({
  LOG_LEVEL: {
    WARN: "WARN",
  },
  PRODUCT_CATEGORY: {
    NON_SUBSCRIPTION: "NON_SUBSCRIPTION",
  },
  PURCHASES_ERROR_CODE: {
    PURCHASE_CANCELLED_ERROR: "PURCHASE_CANCELLED_ERROR",
  },
  Purchases: {
    addCustomerInfoUpdateListener: vi.fn(),
    configure: vi.fn(),
    getCustomerInfo: vi.fn(),
    getProducts: vi.fn(),
    restorePurchases: vi.fn(),
    purchaseStoreProduct: vi.fn(),
    setLogLevel: vi.fn(),
    syncPurchases: vi.fn(),
  },
}));

vi.mock("@/services/analytics", () => ({
  analytics: {
    trackBeginCheckout: vi.fn(),
    trackPurchaseState: vi.fn(),
  },
}));

const inactiveCustomerInfo = {
  entitlements: {
    active: {},
  },
} as unknown as CustomerInfo;

const activeCustomerInfo = {
  entitlements: {
    active: {
      premium_access: {
        isActive: true,
      },
    },
  },
} as unknown as CustomerInfo;

const product = {
  currencyCode: "ZAR",
  description: "Premium access",
  identifier: "premium_access",
  price: 25,
  priceString: "R25",
  title: "Premium Access",
} as PurchasesStoreProduct;

const createStore = (owned: boolean): PurchaseStore => {
  const actions: AnyAction[] = [];

  return {
    dispatch: vi.fn((action: AnyAction) => {
      actions.push(action);
      return action;
    }),
    getState: vi.fn(() => ({
      purchase: {
        owned,
      },
    })),
    replaceReducer: vi.fn(),
    subscribe: vi.fn(),
    actions,
  } as unknown as PurchaseStore;
};

describe("RevenueCatPurchaseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("__REVENUECAT_ANDROID_API_KEY__", "goog_test_key");
    vi.stubGlobal("__REVENUECAT_IOS_API_KEY__", "appl_test_key");
    vi.mocked(Capacitor.getPlatform).mockReturnValue("android");
    vi.mocked(Purchases.configure).mockResolvedValue();
    vi.mocked(Purchases.setLogLevel).mockResolvedValue();
    vi.mocked(Purchases.addCustomerInfoUpdateListener).mockResolvedValue("listener-id");
    vi.mocked(Purchases.getProducts).mockResolvedValue({ products: [product] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("syncs purchases before clearing a legacy premium user without RevenueCat entitlement", async () => {
    vi.mocked(Purchases.getCustomerInfo)
      .mockResolvedValueOnce({ customerInfo: inactiveCustomerInfo })
      .mockResolvedValueOnce({ customerInfo: activeCustomerInfo });
    vi.mocked(Purchases.syncPurchases).mockResolvedValue();
    const store = createStore(true);

    await new RevenueCatPurchaseService(store).initialize();

    expect(Purchases.syncPurchases).toHaveBeenCalledOnce();
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "PURCHASE_RECIEVE_PRODUCT_OWNED",
      payload: { owned: true },
    });
  });

  it("preserves legacy premium access when purchase sync fails", async () => {
    vi.mocked(Purchases.getCustomerInfo).mockResolvedValueOnce({ customerInfo: inactiveCustomerInfo });
    vi.mocked(Purchases.syncPurchases).mockRejectedValue(new Error("Billing unavailable"));
    const store = createStore(true);

    await new RevenueCatPurchaseService(store).initialize();

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "PURCHASE_RECIEVE_PRODUCT_OWNED",
      payload: { owned: true },
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "PURCHASE_RECIEVE_PRODUCT_CAN_PURCHASE",
      payload: { canPurchase: false },
    });
  });
});
