// @vitest-environment jsdom
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { Provider } from "react-redux";
import { act, create } from "react-test-renderer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import Startup from "@/app/Startup";
import { PurchaseContext } from "@/context";
import { ANDROID_PREMIUM_PRODUCT_ID, IOS_PREMIUM_PRODUCT_ID } from "@/services/purchase/productIds";
import { RevenueCatPurchaseService } from "@/services/purchase/RevenueCatPurchaseService";
import { recievePaymentPending, recievePurchaseOrderState } from "@/state/purchase";
import { reducer } from "@/state/purchase/reducer";
import PurchaseModal from "./PurchaseModal";

vi.mock("@/app/Router", () => ({ default: () => null }));
vi.mock("@capacitor/app", () => ({ App: { addListener: vi.fn() } }));
vi.mock("@capacitor/network", () => ({ Network: { addListener: vi.fn() } }));
const networkListeners = new Set();
const appListeners = new Set();

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

vi.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: vi.fn(() => "android") } }));
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
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.resetAllMocks();
  Capacitor.getPlatform.mockReturnValue("android");
  vi.stubGlobal("__REVENUECAT_IOS_API_KEY__", "appl_test");
  networkListeners.clear();
  appListeners.clear();
  Network.addListener.mockImplementation(async (_, listener) => {
    networkListeners.add(listener);
    return { remove: async () => networkListeners.delete(listener) };
  });
  App.addListener.mockImplementation(async (_, listener) => {
    appListeners.add(listener);
    return { remove: async () => appListeners.delete(listener) };
  });
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  vi.stubGlobal("__REVENUECAT_ANDROID_API_KEY__", "goog_test");
  Purchases.getProducts.mockResolvedValue({
    products: [
      {
        identifier: ANDROID_PREMIUM_PRODUCT_ID,
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
  const store = createStore(
    combineReducers({ purchase: reducer, settings: () => ({ theme: "light", language: "en" }) }),
    applyMiddleware(thunk),
  );
  const service = new RevenueCatPurchaseService(store);
  const mount = async (origin, isOpen = true, onDidDismiss = () => {}) => {
    let page;
    await act(async () => {
      page = create(
        <Provider store={store}>
          <PurchaseContext.Provider value={service}>
            <Startup />
            <PurchaseModal origin={origin} isOpen={isOpen} onDidDismiss={onDidDismiss} />
          </PurchaseContext.Provider>
        </Provider>,
      );
    });
    mountedPages.push(page);
    return page;
  };
  return { mount, store };
};

const emitConnected = () => {
  for (const listener of networkListeners) listener({ connected: true, connectionType: "wifi" });
};
const buyButton = (page) =>
  page.root.findAllByType("button").find((button) => button.findAll((node) => node.props.text === "getPremium").length);

it.each([
  ["android", "getProducts"],
  ["android", "getCustomerInfo"],
  ["ios", "getProducts"],
  ["ios", "getCustomerInfo"],
])("recovers %s %s after connectivity returns with the offer still open", async (platform, method) => {
  Capacitor.getPlatform.mockReturnValue(platform);
  if (platform === "ios")
    Purchases.getProducts.mockResolvedValue({
      products: [{ identifier: IOS_PREMIUM_PRODUCT_ID, priceString: "R39.99" }],
    });
  Purchases[method].mockRejectedValueOnce({ code: "10" });
  const { mount, store } = await setupCheckout();
  const page = await mount("mock_test");
  expect(store.getState().purchase.availability).toBe("unavailable");
  expect(buyButton(page).props.disabled).toBe(true);
  await act(async () => emitConnected());
  expect(store.getState().purchase.availability).toBe("ready");
  expect(buyButton(page).props.disabled).toBeFalsy();
  expect(store.getState().purchase.price).toBe("R39.99");
  expect(Purchases.purchaseStoreProduct).not.toHaveBeenCalled();
  await click(page, "getPremium");
  expect(notifications(page)).toEqual(["purchaseSuccessful"]);
});

it("recovers when returning from connection settings without reopening Premium", async () => {
  Purchases.getProducts.mockRejectedValueOnce({ code: "2" });
  const { mount, store } = await setupCheckout();
  const page = await mount("profile");
  expect(store.getState().purchase.availability).toBe("unavailable");
  await act(async () => {
    for (const listener of appListeners) listener({ isActive: true });
  });
  expect(buyButton(page).props.disabled).toBeFalsy();
});

it("does not let optional offering diagnostics block a usable store", async () => {
  Purchases.getOfferings.mockReturnValue(new Promise(() => {}));
  const { mount, store } = await setupCheckout();
  const page = await mount("mock_test");
  expect(store.getState().purchase.availability).toBe("ready");
  expect(buyButton(page).props.disabled).toBeFalsy();
});

it("queues one recovery if connection returns before the offline request rejects", async () => {
  let rejectOffline;
  Purchases.getCustomerInfo.mockReturnValueOnce(
    new Promise((_, reject) => {
      rejectOffline = reject;
    }),
  );
  const { mount, store } = await setupCheckout();
  const page = await mount("mock_test");
  expect(store.getState().purchase.availability).toBe("loading");
  await act(async () => {
    emitConnected();
    emitConnected();
    for (const listener of appListeners) listener({ isActive: true });
    rejectOffline({ code: "10" });
  });
  expect(store.getState().purchase.availability).toBe("ready");
  expect(buyButton(page).props.disabled).toBeFalsy();
  expect(Purchases.getProducts).toHaveBeenCalledTimes(2);
  expect(Purchases.configure).toHaveBeenCalledOnce();
  expect(Purchases.addCustomerInfoUpdateListener).toHaveBeenCalledOnce();
});

it("keeps feedback and manual retry when a connected network still cannot reach the store", async () => {
  Purchases.getProducts.mockRejectedValue({ code: "10" });
  const { mount, store } = await setupCheckout();
  const page = await mount("mock_test");
  await act(async () => emitConnected());
  await act(async () => vi.advanceTimersByTimeAsync(60_000));
  expect(store.getState().purchase.availability).toBe("unavailable");
  expect(Purchases.getProducts).toHaveBeenCalledTimes(2);
  expect(page.root.findAll((node) => node.props.text === "premiumUnavailable").length).toBeGreaterThan(0);
  Purchases.getProducts.mockResolvedValue({
    products: [{ identifier: ANDROID_PREMIUM_PRODUCT_ID, priceString: "R39.99" }],
  });
  await click(page, "premiumRetry");
  expect(buyButton(page).props.disabled).toBeFalsy();
});

it.each(["ready", "checkout", "deferred", "owned"])("does not interrupt %s with a recovery request", async (state) => {
  if (state !== "ready") Purchases.getProducts.mockRejectedValueOnce({ code: "10" });
  if (state === "owned") Purchases.getCustomerInfo.mockResolvedValue({ customerInfo: premiumCustomer });
  const { mount, store } = await setupCheckout();
  await mount("mock_test");
  act(() => {
    if (state === "checkout") store.dispatch(recievePurchaseOrderState("pending"));
    if (state === "deferred") store.dispatch(recievePaymentPending(true));
  });
  const calls = Purchases.getProducts.mock.calls.length;
  await act(async () => emitConnected());
  expect(Purchases.getProducts).toHaveBeenCalledTimes(calls);
  if (state === "owned") expect(store.getState().purchase.owned).toBe(true);
});

it("removes listeners and cancels a queued recovery when Startup unmounts", async () => {
  let rejectOffline;
  Purchases.getProducts.mockReturnValueOnce(
    new Promise((_, reject) => {
      rejectOffline = reject;
    }),
  );
  const { mount } = await setupCheckout();
  const page = await mount("mock_test");
  await act(async () => emitConnected());
  await act(async () => page.unmount());
  await act(async () => rejectOffline({ code: "10" }));
  expect(Purchases.getProducts).toHaveBeenCalledOnce();
  expect(networkListeners.size).toBe(0);
  expect(appListeners.size).toBe(0);
});

it("does not lose a second reconnect while a recovery request is still failing", async () => {
  let rejectRecovery;
  Purchases.getProducts.mockRejectedValueOnce({ code: "10" }).mockReturnValueOnce(
    new Promise((_, reject) => {
      rejectRecovery = reject;
    }),
  );
  const { mount, store } = await setupCheckout();
  const page = await mount("mock_test");
  await act(async () => emitConnected());
  expect(store.getState().purchase.availability).toBe("loading");
  await act(async () => {
    for (const listener of networkListeners) listener({ connected: false, connectionType: "none" });
    emitConnected();
    rejectRecovery({ code: "10" });
  });
  expect(buyButton(page).props.disabled).toBeFalsy();
  expect(Purchases.getProducts).toHaveBeenCalledTimes(3);
});
