import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { type CustomerInfo, Purchases, type PurchasesStoreProduct } from "@revenuecat/purchases-capacitor";
import { combineReducers, createStore } from "redux";
import { reducer } from "@/state/purchase/reducer";
import { LocalPurchaseService } from "./LocalPurchaseService";
import { RevenueCatPurchaseService } from "./RevenueCatPurchaseService";

vi.mock("@capacitor/core", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  Capacitor: { getPlatform: () => "android" },
}));
vi.mock("@capacitor-firebase/analytics", () => ({ FirebaseAnalytics: { logEvent: vi.fn() } }));
vi.mock("@revenuecat/purchases-capacitor", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  Purchases: {
    configure: vi.fn(),
    setLogLevel: vi.fn(),
    addCustomerInfoUpdateListener: vi.fn(),
    getProducts: vi.fn(),
    getCustomerInfo: vi.fn(),
    getOfferings: vi.fn(),
    purchaseStoreProduct: vi.fn(),
    restorePurchases: vi.fn(),
  },
}));
const customerInfo = { entitlements: { active: {} } } as unknown as CustomerInfo;
const product = {
  identifier: "premium_access",
  price: 39.99,
  priceString: "R39.99",
  currencyCode: "ZAR",
} as PurchasesStoreProduct;
const events = () => vi.mocked(FirebaseAnalytics.logEvent).mock.calls.map(([event]) => event);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("__REVENUECAT_ANDROID_API_KEY__", "goog_test");
  vi.mocked(Purchases.getCustomerInfo).mockResolvedValue({ customerInfo });
  vi.mocked(Purchases.getProducts).mockResolvedValue({ products: [product] });
  vi.mocked(Purchases.getOfferings).mockResolvedValue({ all: {}, current: null });
});
afterEach(() => vi.unstubAllGlobals());

it("reports a missing purchase key once during initialization without an offer or checkout", async () => {
  vi.stubGlobal("__REVENUECAT_ANDROID_API_KEY__", "");
  const store = createStore(combineReducers({ purchase: reducer }));
  const service = new RevenueCatPurchaseService(store);
  await Promise.all([service.initialize(), service.initialize()]);
  await service.initialize();
  expect(store.getState().purchase.canPurchase).toBe(false);
  expect(events()).toEqual([
    {
      name: "purchase_initialization_error",
      params: expect.objectContaining({
        product_id: "premium_access",
        failure_reason: "missing_api_key",
        transaction_environment: "unknown",
      }),
    },
  ]);
});

it("correlates checkout and cancellation without labelling an open store sheet as a pending payment", async () => {
  let cancel!: (error: unknown) => void;
  vi.mocked(Purchases.purchaseStoreProduct).mockImplementation(
    () =>
      new Promise((_, reject) => {
        cancel = reject;
      }),
  );
  const store = createStore(combineReducers({ purchase: reducer }));
  const service = new RevenueCatPurchaseService(store);
  await service.initialize();
  const attempt = service.purchase();
  await vi.waitFor(() => expect(Purchases.purchaseStoreProduct).toHaveBeenCalled());
  expect(events().map(({ name }) => name)).toEqual(["begin_checkout"]);
  cancel({ userCancelled: true, code: "1" });
  await attempt;
  expect(events()[0].params?.attempt_id).toEqual(expect.any(String));
  expect(events()[1]).toMatchObject({
    name: "purchase_cancel",
    params: { attempt_id: events()[0].params?.attempt_id },
  });
  expect(store.getState().purchase.owned).toBe(false);
});

it("reports sandbox entitlement access without creating a client revenue event", async () => {
  vi.mocked(Purchases.purchaseStoreProduct).mockResolvedValue({
    productIdentifier: "premium_access",
    transaction: {
      transactionIdentifier: "private-store-id",
      productIdentifier: "premium_access",
      purchaseDate: "2026-10-06",
      purchaseToken: null,
      originalJson: null,
      signature: null,
    },
    customerInfo: {
      entitlements: { active: { premium_access: { isActive: true, isSandbox: true } } },
    } as unknown as CustomerInfo,
  });
  const store = createStore(combineReducers({ purchase: reducer }));
  await new RevenueCatPurchaseService(store).purchase();
  expect(store.getState().purchase.owned).toBe(true);
  expect(events().map(({ name }) => name)).toEqual(["begin_checkout", "checkout_outcome"]);
  expect(events()[1]).toMatchObject({
    params: {
      outcome: "access_granted",
      transaction_environment: "sandbox",
      attempt_id: events()[0].params?.attempt_id,
    },
  });
  expect(JSON.stringify(events())).not.toContain("private-store-id");
});

it.each([
  ["20", "purchase_pending"],
  ["10", "purchase_error"],
  ["5", "purchase_unavailable"],
])("distinguishes store outcome %s from a cancellation", async (code, eventName) => {
  vi.mocked(Purchases.purchaseStoreProduct).mockRejectedValue({ code, message: "private diagnostic" });
  const store = createStore(combineReducers({ purchase: reducer }));
  await new RevenueCatPurchaseService(store).purchase();
  expect(events()[1]).toMatchObject({
    name: eventName,
    params: { attempt_id: events()[0].params?.attempt_id, error_code: code, transaction_environment: "unknown" },
  });
  expect(events().some(({ name }) => name === "checkout_outcome")).toBe(false);
  expect(store.getState().purchase.orderState).not.toBe("pending");
  expect(JSON.stringify(events())).not.toContain("private diagnostic");
});

it("reports a missing product before disabled premium controls can be used, once per initialization", async () => {
  vi.mocked(Purchases.getProducts).mockResolvedValue({ products: [] });
  const store = createStore(combineReducers({ purchase: reducer }));
  const service = new RevenueCatPurchaseService(store);
  await Promise.all([service.initialize(), service.initialize()]);
  await service.initialize();
  expect(store.getState().purchase.canPurchase).toBe(false);
  expect(events()).toEqual([
    {
      name: "purchase_initialization_error",
      params: expect.objectContaining({ product_id: "premium_access", failure_reason: "product_unavailable" }),
    },
  ]);
});

it("records an unavailable checkout attempt without claiming the store sheet opened", async () => {
  vi.mocked(Purchases.getProducts).mockResolvedValue({ products: [] });
  await new RevenueCatPurchaseService(createStore(combineReducers({ purchase: reducer }))).purchase();
  expect(events()).toEqual([
    {
      name: "purchase_initialization_error",
      params: expect.objectContaining({ failure_reason: "product_unavailable" }),
    },
    {
      name: "purchase_unavailable",
      params: expect.objectContaining({
        attempt_id: expect.any(String),
        product_id: "premium_access",
        availability: "unavailable",
      }),
    },
  ]);
});

it("reports an SDK initialization failure once with a code but no private diagnostic or false funnel events", async () => {
  vi.mocked(Purchases.getProducts).mockRejectedValue({ code: "10", message: "private diagnostic" });
  const store = createStore(combineReducers({ purchase: reducer }));
  const service = new RevenueCatPurchaseService(store);
  await Promise.all([service.initialize(), service.initialize()]);
  await service.initialize();
  expect(store.getState().purchase.canPurchase).toBe(false);
  expect(events()).toEqual([
    {
      name: "purchase_initialization_error",
      params: expect.objectContaining({
        product_id: "premium_access",
        failure_reason: "sdk_error",
        error_code: "10",
      }),
    },
  ]);
  expect(JSON.stringify(events())).not.toContain("private diagnostic");
});

it.each([true, false])("reports restored access=%s as a restore outcome and never as a sale", async (owned) => {
  vi.mocked(Purchases.restorePurchases).mockResolvedValue({
    customerInfo: owned
      ? ({
          entitlements: { active: { premium_access: { isActive: true, isSandbox: false } } },
        } as unknown as CustomerInfo)
      : customerInfo,
  });
  const store = createStore(combineReducers({ purchase: reducer }));
  await new RevenueCatPurchaseService(store).restore();
  expect(store.getState().purchase.owned).toBe(owned);
  expect(events().map(({ name }) => name)).toEqual(["restore_start", "restore_outcome"]);
  expect(events()[1]).toMatchObject({
    params: { outcome: owned ? "access_restored" : "no_entitlement", attempt_id: events()[0].params?.attempt_id },
  });
});

it("records an offer opening once with loaded price, origin and eligibility; a new opening counts again", async () => {
  const service = new RevenueCatPurchaseService(createStore(combineReducers({ purchase: reducer })));
  const close = service.offerOpened("mock_test");
  await vi.waitFor(() => expect(events().filter(({ name }) => name === "view_promotion")).toHaveLength(1));
  await service.initialize();
  expect(events().filter(({ name }) => name === "view_promotion")).toEqual([
    {
      name: "view_promotion",
      params: expect.objectContaining({
        offer_origin: "mock_test",
        price: "R39.99",
        currency: "ZAR",
        value: 39.99,
        availability: "available",
        eligibility: "eligible",
      }),
    },
  ]);
  close();
  service.offerOpened("profile");
  await vi.waitFor(() => expect(events().filter(({ name }) => name === "view_promotion")).toHaveLength(2));
});

it("does not record an offer that closed before the product loaded", async () => {
  const service = new RevenueCatPurchaseService(createStore(combineReducers({ purchase: reducer })));
  service.offerOpened("profile")();
  await service.initialize();
  expect(events()).toEqual([]);
});

it("records unavailable offer context without inventing a local price or currency", async () => {
  vi.mocked(Purchases.getProducts).mockResolvedValue({ products: [] });
  const service = new RevenueCatPurchaseService(createStore(combineReducers({ purchase: reducer })));
  service.offerOpened("profile");
  await vi.waitFor(() => expect(events()).toHaveLength(2));
  expect(events()[1]).toMatchObject({
    name: "view_promotion",
    params: { availability: "unavailable", eligibility: "unavailable" },
  });
  expect(events()[1].params).not.toHaveProperty("currency");
  expect(events()[1].params).not.toHaveProperty("price");
});

it("keeps local simulated checkout correlated and clearly separate from store activity", () => {
  const store = createStore(combineReducers({ purchase: reducer }));
  const service = new LocalPurchaseService(store);
  service.initialize();
  service.purchase("profile");
  expect(events().map(({ name }) => name)).toEqual(["begin_checkout", "checkout_outcome"]);
  expect(events()[0]).toMatchObject({
    params: { attempt_id: expect.any(String), offer_origin: "profile", execution_context: "local" },
  });
  expect(events()[1]).toMatchObject({
    params: { attempt_id: events()[0].params?.attempt_id, execution_context: "local" },
  });
});
