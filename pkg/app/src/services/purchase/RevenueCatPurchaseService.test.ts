import { Capacitor } from "@capacitor/core";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { type CustomerInfo, Purchases, type PurchasesStoreProduct } from "@revenuecat/purchases-capacitor";
import { createStore } from "redux";
import { defaultState, type PuchaseActions, type PurchaseState, reducer } from "@/state/purchase";
import { RevenueCatPurchaseService } from "./RevenueCatPurchaseService";

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
    PURCHASE_CANCELLED_ERROR: "cancelled",
    PAYMENT_PENDING_ERROR: "pending",
    PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR: "unavailable",
  },
  Purchases: {
    addCustomerInfoUpdateListener: vi.fn(),
    configure: vi.fn(),
    getCustomerInfo: vi.fn(),
    getProducts: vi.fn(),
    getOfferings: vi.fn(),
    restorePurchases: vi.fn(),
    purchaseStoreProduct: vi.fn(),
    setLogLevel: vi.fn(),
    syncPurchases: vi.fn(),
  },
}));

vi.mock("@capacitor-firebase/analytics", () => ({ FirebaseAnalytics: { logEvent: vi.fn() } }));

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

const checkoutStore = (owned = false) =>
  createStore(
    (state: { purchase: PurchaseState } = { purchase: { ...defaultState, owned } }, action: PuchaseActions) => ({
      purchase: reducer(state.purchase, action),
    }),
  );

describe("RevenueCatPurchaseService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("__REVENUECAT_ANDROID_API_KEY__", "goog_test_key");
    vi.stubGlobal("__REVENUECAT_IOS_API_KEY__", "appl_test_key");
    vi.mocked(Capacitor.getPlatform).mockReturnValue("android");
    vi.mocked(Purchases.configure).mockResolvedValue();
    vi.mocked(Purchases.setLogLevel).mockResolvedValue();
    vi.mocked(Purchases.addCustomerInfoUpdateListener).mockResolvedValue("listener-id");
    vi.mocked(Purchases.getProducts).mockResolvedValue({ products: [product] });
    vi.mocked(Purchases.getCustomerInfo).mockResolvedValue({ customerInfo: inactiveCustomerInfo });
    vi.mocked(Purchases.getOfferings).mockResolvedValue({ all: {}, current: null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each(["products", "customer"])(
    "recovers a failed %s load without configuring or subscribing twice",
    async (resource) => {
      if (resource === "products") vi.mocked(Purchases.getProducts).mockRejectedValueOnce(new Error("Offline"));
      else vi.mocked(Purchases.getCustomerInfo).mockRejectedValueOnce(new Error("Offline"));
      const store = checkoutStore();
      const service = new RevenueCatPurchaseService(store);
      await service.initialize();
      expect(store.getState().purchase.canPurchase).toBe(false);
      await service.initialize();
      expect(store.getState().purchase.canPurchase).toBe(true);
      expect(store.getState().purchase.price).toBe("R25");
      expect(Purchases.configure).toHaveBeenCalledOnce();
      expect(Purchases.addCustomerInfoUpdateListener).toHaveBeenCalledOnce();
    },
  );

  it("reconciles paid access even when product loading is offline", async () => {
    vi.mocked(Purchases.getProducts).mockRejectedValue(new Error("Offline"));
    vi.mocked(Purchases.getCustomerInfo).mockResolvedValue({ customerInfo: activeCustomerInfo });
    const store = checkoutStore();
    await new RevenueCatPurchaseService(store).initialize();
    expect(store.getState().purchase.owned).toBe(true);
    expect(store.getState().purchase.canPurchase).toBe(false);
  });

  it("preserves legacy access through failed sync and passive updates, then reconciles on retry", async () => {
    vi.mocked(Purchases.syncPurchases).mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce();
    const store = checkoutStore(true);
    const service = new RevenueCatPurchaseService(store);
    await service.initialize();
    const listener = vi.mocked(Purchases.addCustomerInfoUpdateListener).mock.calls[0][0];
    listener(inactiveCustomerInfo);
    expect(store.getState().purchase.owned).toBe(true);
    await service.initialize();
    expect(store.getState().purchase.owned).toBe(false);
    expect(store.getState().purchase.canPurchase).toBe(true);
    expect(Purchases.configure).toHaveBeenCalledOnce();
  });

  it.each(["purchase", "restore"] as const)("serializes duplicate and overlapping %s calls", async (operation) => {
    const store = checkoutStore();
    const service = new RevenueCatPurchaseService(store);
    let finish!: (value: { customerInfo: CustomerInfo }) => void;
    const response = new Promise<{ customerInfo: CustomerInfo }>((resolve) => {
      finish = resolve;
    });
    vi.mocked(Purchases.purchaseStoreProduct).mockReturnValue(
      response as ReturnType<typeof Purchases.purchaseStoreProduct>,
    );
    vi.mocked(Purchases.restorePurchases).mockReturnValue(response);
    const first = service[operation]();
    const duplicate = service[operation]();
    const overlap = service[operation === "purchase" ? "restore" : "purchase"]();
    finish({ customerInfo: activeCustomerInfo });
    await Promise.all([first, duplicate, overlap]);
    expect(
      vi.mocked(Purchases.purchaseStoreProduct).mock.calls.length +
        vi.mocked(Purchases.restorePurchases).mock.calls.length,
    ).toBe(1);
    expect(store.getState().purchase.owned).toBe(true);
  });

  it.each(["store_pending", "delayed_entitlement"])(
    "waits for authoritative access after %s and records completion once",
    async (scenario) => {
      if (scenario === "store_pending")
        vi.mocked(Purchases.purchaseStoreProduct).mockRejectedValue({ code: "pending" });
      else
        vi.mocked(Purchases.purchaseStoreProduct).mockResolvedValue({ customerInfo: inactiveCustomerInfo } as Awaited<
          ReturnType<typeof Purchases.purchaseStoreProduct>
        >);
      const store = checkoutStore();
      const service = new RevenueCatPurchaseService(store);
      await service.purchase("mock_test");
      expect(store.getState().purchase.orderState).toBe("deferred");
      expect(store.getState().purchase.owned).toBe(false);
      expect(store.getState().purchase.canPurchase).toBe(false);
      await service.purchase("profile");
      expect(Purchases.purchaseStoreProduct).toHaveBeenCalledOnce();
      const listener = vi.mocked(Purchases.addCustomerInfoUpdateListener).mock.calls[0][0];
      listener(activeCustomerInfo);
      listener(activeCustomerInfo);
      expect(store.getState().purchase.owned).toBe(true);
      expect(store.getState().purchase.paymentPending).toBe(false);
      const events = vi.mocked(FirebaseAnalytics.logEvent).mock.calls.map(([event]) => event);
      const begin = events.find((event) => event.name === "begin_checkout");
      expect(events.filter((event) => event.name === "purchase_pending")).toHaveLength(
        scenario === "store_pending" ? 1 : 0,
      );
      const outcomes = events.filter((event) => event.name === "checkout_outcome");
      expect(outcomes).toHaveLength(1);
      expect(outcomes[0].params).toMatchObject({
        attempt_id: begin?.params?.attempt_id,
        offer_origin: "mock_test",
        outcome: "access_granted",
      });
    },
  );

  it.each(["no_entitlement", "restore_failure"])(
    "only releases a deferred retry after a successful explicit restore (%s)",
    async (outcome) => {
      const store = checkoutStore();
      const service = new RevenueCatPurchaseService(store);
      vi.mocked(Purchases.purchaseStoreProduct).mockRejectedValueOnce({ code: "pending" });
      await service.purchase("mock_test");
      // Passive refresh cannot establish whether a store-pending payment was declined.
      await service.initialize(true);
      expect(store.getState().purchase.paymentPending).toBe(true);
      if (outcome === "restore_failure") {
        vi.mocked(Purchases.restorePurchases).mockRejectedValueOnce(new Error("Offline"));
        await service.restore("mock_test");
        expect(store.getState().purchase.paymentPending).toBe(true);
        await service.purchase("mock_test");
        expect(Purchases.purchaseStoreProduct).toHaveBeenCalledOnce();
      }
      vi.mocked(Purchases.restorePurchases).mockResolvedValueOnce({ customerInfo: inactiveCustomerInfo });
      await service.restore("mock_test");
      expect(store.getState().purchase.paymentPending).toBe(false);
      expect(store.getState().purchase.canPurchase).toBe(true);
      vi.mocked(Purchases.purchaseStoreProduct).mockResolvedValueOnce({ customerInfo: activeCustomerInfo } as Awaited<
        ReturnType<typeof Purchases.purchaseStoreProduct>
      >);
      await service.purchase("mock_test");
      expect(Purchases.purchaseStoreProduct).toHaveBeenCalledTimes(2);
      expect(store.getState().purchase.owned).toBe(true);
    },
  );

  it.each(["initialize", "purchase", "restore"] as const)(
    "keeps a newer entitlement listener update when a slower %s response settles",
    async (operation) => {
      const store = checkoutStore();
      const service = new RevenueCatPurchaseService(store);
      if (operation !== "initialize") await service.initialize();
      let finish!: (value: { customerInfo: CustomerInfo }) => void;
      const response = new Promise<{ customerInfo: CustomerInfo }>((resolve) => {
        finish = resolve;
      });
      const method =
        operation === "initialize"
          ? Purchases.getCustomerInfo
          : operation === "purchase"
            ? Purchases.purchaseStoreProduct
            : Purchases.restorePurchases;
      vi.mocked(method).mockReturnValue(response as ReturnType<typeof Purchases.purchaseStoreProduct>);
      const attempt = service[operation]();
      await vi.waitFor(() => expect(method).toHaveBeenCalled());
      vi.mocked(Purchases.addCustomerInfoUpdateListener).mock.calls[0][0](activeCustomerInfo);
      expect(store.getState().purchase.owned).toBe(true);
      finish({ customerInfo: inactiveCustomerInfo });
      await attempt;
      expect(store.getState().purchase.owned).toBe(true);
      expect(store.getState().purchase.paymentPending).toBe(false);
      expect(store.getState().purchase.orderState).not.toBe("deferred");
    },
  );

  it("syncs purchases before clearing a legacy premium user without RevenueCat entitlement", async () => {
    vi.mocked(Purchases.getCustomerInfo)
      .mockResolvedValueOnce({ customerInfo: inactiveCustomerInfo })
      .mockResolvedValueOnce({ customerInfo: activeCustomerInfo });
    vi.mocked(Purchases.syncPurchases).mockResolvedValue();
    const store = checkoutStore(true);

    await new RevenueCatPurchaseService(store).initialize();

    expect(Purchases.syncPurchases).toHaveBeenCalledOnce();
    expect(store.getState().purchase.owned).toBe(true);
  });
});
