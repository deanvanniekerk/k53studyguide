import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { Provider } from "react-redux";
import { act, create } from "react-test-renderer";
import { combineReducers, createStore } from "redux";
import { PurchaseContext } from "@/context";
import { IOS_PREMIUM_PRODUCT_ID } from "@/services/purchase/productIds";
import { RevenueCatPurchaseService } from "@/services/purchase/RevenueCatPurchaseService";
import { recievePurchaseOrderState, recievePurchaseProductCanPurchase } from "@/state/purchase";
import { defaultState, reducer } from "@/state/purchase/reducer";
import PurchaseModal from "./PurchaseModal";

vi.mock("@capacitor-firebase/analytics", () => ({ FirebaseAnalytics: { logEvent: vi.fn() } }));
vi.mock("@ionic/react", () => ({
  IonButton: ({ children, ...props }) => <button {...props}>{children}</button>,
  IonModal: ({ children, isOpen }) => (isOpen ? <section>{children}</section> : null),
  IonToast: ({ isOpen, message, onDidDismiss }) => (isOpen ? <output onClick={onDidDismiss}>{message}</output> : null),
  IonLoading: ({ isOpen }) => (isOpen ? <aside>processingPayment</aside> : null),
  IonIcon: () => null,
  IonText: ({ children }) => <span>{children}</span>,
  IonContent: ({ children }) => <div>{children}</div>,
  IonPage: ({ children }) => <div>{children}</div>,
  IonItem: ({ children }) => <div>{children}</div>,
  IonLabel: ({ children }) => <span>{children}</span>,
  CreateAnimation: ({ children }) => <>{children}</>,
}));
vi.mock("@k53studyguide/shared/translation", () => ({
  Translate: ({ text }) => <>{text}</>,
  Translator: ({ children }) => children({ translate: ({ text }) => text }),
}));

vi.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: () => "ios" } }));
vi.mock("@revenuecat/purchases-capacitor", () => ({
  LOG_LEVEL: { WARN: "WARN" },
  PRODUCT_CATEGORY: { NON_SUBSCRIPTION: "NON_SUBSCRIPTION" },
  PURCHASES_ERROR_CODE: {
    PURCHASE_CANCELLED_ERROR: "cancelled",
    PAYMENT_PENDING_ERROR: "pending",
    PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR: "unavailable",
  },
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

const freeCustomer = { entitlements: { active: {} } };
const premiumCustomer = { entitlements: { active: { premium_access: { isActive: true } } } };
const mountedPages = [];

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  vi.stubGlobal("__REVENUECAT_IOS_API_KEY__", "appl_test");
  Purchases.getProducts.mockResolvedValue({
    products: [
      {
        identifier: IOS_PREMIUM_PRODUCT_ID,
        priceString: "R39.99",
        price: 39.99,
        title: "Premium",
        description: "Premium access",
        currencyCode: "ZAR",
      },
    ],
  });
  Purchases.getCustomerInfo.mockResolvedValue({ customerInfo: freeCustomer });
  Purchases.getOfferings.mockResolvedValue({ all: {}, current: null });
  Purchases.purchaseStoreProduct.mockResolvedValue({ customerInfo: premiumCustomer });
  Purchases.restorePurchases.mockResolvedValue({ customerInfo: premiumCustomer });
});
afterEach(() => {
  act(() => {
    for (const page of mountedPages.splice(0)) page.unmount();
  });
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const notifications = (page) => page.root.findAllByType("output").map((toast) => toast.props.children);
const click = async (page, label) => {
  const button = page.root
    .findAllByType("button")
    .find((candidate) => candidate.findAll((node) => node.props.text === label).length);
  expect(button.props.disabled).toBeFalsy();
  await act(async () => {
    button.props.onClick();
  });
};
const setupCheckout = async () => {
  const store = createStore(combineReducers({ purchase: reducer }));
  const service = new RevenueCatPurchaseService(store);
  await service.initialize();
  const mount = async (origin, isOpen = true, onDidDismiss = () => {}) => {
    let page;
    await act(async () => {
      page = create(
        <Provider store={store}>
          <PurchaseContext.Provider value={service}>
            <PurchaseModal origin={origin} isOpen={isOpen} onDidDismiss={onDidDismiss} />
          </PurchaseContext.Provider>
        </Provider>,
      );
    });
    mountedPages.push(page);
    return page;
  };
  const refresh = () => Purchases.addCustomerInfoUpdateListener.mock.calls[0][0](premiumCustomer);
  return { mount, refresh, store, service };
};

it("does not thank an existing premium learner when Test or Profile mounts with a saved finished order", () => {
  vi.useFakeTimers();
  const store = createStore(combineReducers({ purchase: reducer }), {
    purchase: { ...defaultState, owned: true, orderState: "finished" },
  });
  for (const origin of ["mock_test", "profile", "mock_test"]) {
    let page;
    act(() => {
      page = create(
        <Provider store={store}>
          <PurchaseModal origin={origin} isOpen={false} onDidDismiss={() => {}} />
        </Provider>,
      );
    });
    expect(page.root.findAllByType("output")).toHaveLength(0);
    act(() => page.unmount());
  }
});

it("thanks only the initiating checkout once, without replaying on refresh or page revisits", async () => {
  const { mount, refresh } = await setupCheckout();
  const testPage = await mount("mock_test");
  const profile = await mount("profile", false);
  await click(testPage, "getPremium");
  expect(Purchases.purchaseStoreProduct).toHaveBeenCalledTimes(1);
  expect(notifications(testPage)).toEqual(["purchaseSuccessful"]);
  expect(notifications(profile)).toEqual([]);
  act(() => testPage.root.findByType("output").props.onClick());
  act(() => refresh());
  expect(notifications(testPage)).toEqual([]);
  expect(notifications(await mount("mock_test", false))).toEqual([]);
  expect(notifications(await mount("profile", false))).toEqual([]);
});

it("restores access with one restore message and never a purchase thank-you", async () => {
  const { mount, refresh } = await setupCheckout();
  const profile = await mount("profile");
  const testPage = await mount("mock_test", false);
  await click(profile, "restorePurchase");
  expect(notifications(profile)).toEqual(["purchaseRestored"]);
  expect(notifications(testPage)).toEqual([]);
  act(() => profile.root.findByType("output").props.onClick());
  act(() => refresh());
  expect(notifications(profile)).toEqual([]);
  expect(notifications(await mount("profile", false))).toEqual([]);
});

it("silently refreshes premium access without an initiated checkout", async () => {
  const { mount, refresh } = await setupCheckout();
  const page = await mount("profile", false);
  act(() => refresh());
  expect(notifications(page)).toEqual([]);
});

it.each([
  [{ code: "cancelled", userCancelled: true }, "purchaseCancelled"],
  [{ code: "network_error" }, "purchaseFailed"],
])("keeps unsuccessful checkout feedback local and allows a successful retry (%j)", async (error, message) => {
  const { mount } = await setupCheckout();
  const page = await mount("mock_test");
  const otherPage = await mount("profile", false);
  Purchases.purchaseStoreProduct.mockRejectedValueOnce(error);
  await click(page, "getPremium");
  expect(notifications(page)).toEqual([message]);
  expect(notifications(otherPage)).toEqual([]);
  act(() => page.root.findByType("output").props.onClick());
  await click(page, "getPremium");
  expect(notifications(page)).toEqual(["purchaseSuccessful"]);
  expect(notifications(otherPage)).toEqual([]);
});

it("preserves the quiz-results origin through checkout", async () => {
  const { mount } = await setupCheckout();
  const page = await mount("quiz_results");
  await click(page, "getPremium");
  expect(FirebaseAnalytics.logEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "begin_checkout",
      params: expect.objectContaining({ offer_origin: "quiz_results" }),
    }),
  );
});

it("keeps restore available when purchasing is unavailable", async () => {
  const { mount, store } = await setupCheckout();
  const page = await mount("mock_test");
  act(() => store.dispatch(recievePurchaseProductCanPurchase(false)));
  const button = page.root
    .findAllByType("button")
    .find((candidate) => candidate.findAll((node) => node.props.text === "getPremium").length);
  expect(button.props.disabled).toBe(true);
  expect(page.root.findAll((node) => node.props.text === "premiumUnavailable").length).toBeGreaterThan(0);
  await click(page, "restorePurchase");
  expect(Purchases.restorePurchases).toHaveBeenCalledTimes(1);
});

it("does not close the offer with the close button while a payment is pending", async () => {
  const { mount, store } = await setupCheckout();
  const dismiss = vi.fn();
  const page = await mount("mock_test", true, dismiss);
  act(() => store.dispatch(recievePurchaseOrderState("pending")));
  FirebaseAnalytics.logEvent.mockClear();
  act(() => page.root.findByProps({ "aria-label": "Close" }).props.onClick());
  expect(dismiss).not.toHaveBeenCalled();
  expect(FirebaseAnalytics.logEvent).not.toHaveBeenCalledWith(expect.objectContaining({ name: "premium_offer_close" }));
});

it("lets an offline learner retry loading the store without hiding Restore", async () => {
  Purchases.getProducts.mockRejectedValue(new Error("Offline"));
  const { mount } = await setupCheckout();
  const page = await mount("mock_test");
  expect(page.root.findAll((node) => node.props.text === "premiumUnavailable").length).toBeGreaterThan(0);
  Purchases.getProducts.mockResolvedValue({
    products: [{ identifier: IOS_PREMIUM_PRODUCT_ID, priceString: "R39.99" }],
  });
  await click(page, "premiumRetry");
  await click(page, "getPremium");
  expect(notifications(page)).toEqual(["purchaseSuccessful"]);
  expect(Purchases.configure).toHaveBeenCalledOnce();
  expect(Purchases.addCustomerInfoUpdateListener).toHaveBeenCalledOnce();
});

it("shows deferred payment without a blocking spinner or failure, then consumes late access once", async () => {
  const { mount, refresh } = await setupCheckout();
  const dismiss = vi.fn();
  const page = await mount("mock_test", true, dismiss);
  Purchases.purchaseStoreProduct.mockRejectedValueOnce({ code: "pending" });
  await click(page, "getPremium");
  expect(notifications(page)).toEqual([]);
  expect(page.root.findAllByType("aside")).toHaveLength(0);
  expect(page.root.findAll((node) => node.props.text === "premiumPaymentPending").length).toBeGreaterThan(0);
  act(() => refresh());
  expect(notifications(page)).toEqual(["purchaseSuccessful"]);
  act(() => page.root.findByType("output").props.onClick());
  act(() => refresh());
  expect(notifications(page)).toEqual([]);
});

it("allows closing and restoring a deferred payment without replaying a purchase thank-you", async () => {
  const { mount } = await setupCheckout();
  const dismiss = vi.fn();
  const page = await mount("mock_test", true, dismiss);
  Purchases.purchaseStoreProduct.mockRejectedValueOnce({ code: "pending" });
  await click(page, "getPremium");
  act(() => page.root.findByProps({ "aria-label": "Close" }).props.onClick());
  expect(dismiss).toHaveBeenCalledOnce();
  await click(page, "restorePurchase");
  expect(notifications(page)).toEqual(["purchaseRestored"]);
});

it("silently grants deferred access after its initiating modal has closed", async () => {
  const { mount, refresh, store, service } = await setupCheckout();
  const page = await mount("mock_test");
  Purchases.purchaseStoreProduct.mockRejectedValueOnce({ code: "pending" });
  await click(page, "getPremium");
  act(() =>
    page.update(
      <Provider store={store}>
        <PurchaseContext.Provider value={service}>
          <PurchaseModal origin="mock_test" isOpen={false} onDidDismiss={() => {}} />
        </PurchaseContext.Provider>
      </Provider>,
    ),
  );
  act(() => refresh());
  expect(store.getState().purchase.owned).toBe(true);
  expect(notifications(page)).toEqual([]);
  expect(notifications(await mount("profile", false))).toEqual([]);
});

it("allows retrying a declined deferred payment after Restore checks for access", async () => {
  const { mount, refresh, store } = await setupCheckout();
  const page = await mount("mock_test");
  Purchases.purchaseStoreProduct.mockRejectedValueOnce({ code: "pending" });
  await click(page, "getPremium");
  Purchases.restorePurchases.mockResolvedValueOnce({ customerInfo: { entitlements: { active: {} } } });
  await click(page, "restorePurchase");
  expect(store.getState().purchase.paymentPending).toBe(false);
  expect(page.root.findAll((node) => node.props.text === "premiumPaymentPending")).toHaveLength(0);
  act(() => page.root.findByType("output").props.onClick());
  await click(page, "getPremium");
  expect(notifications(page)).toEqual(["purchaseSuccessful"]);
  expect(Purchases.purchaseStoreProduct).toHaveBeenCalledTimes(2);
  act(() => page.root.findByType("output").props.onClick());
  act(() => refresh());
  expect(notifications(page)).toEqual([]);
  expect(notifications(await mount("profile", false))).toEqual([]);
});
