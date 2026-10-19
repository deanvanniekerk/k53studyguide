import { vi } from "vitest";

const sdk = vi.hoisted(() => ({
  initializeApp: vi.fn(() => ({ name: "[DEFAULT]" })),
  initializeAnalytics: vi.fn(),
  logEvent: vi.fn(),
  setUserProperty: vi.fn(),
  setCurrentScreen: vi.fn(),
}));
vi.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: () => "web" } }));
vi.mock("firebase/app", () => ({ initializeApp: sdk.initializeApp, getApps: () => [] }));
vi.mock("firebase/analytics", () => ({ initializeAnalytics: sdk.initializeAnalytics }));
vi.mock("@capacitor-firebase/analytics", () => ({ FirebaseAnalytics: sdk }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  const values = new Map();
  vi.stubGlobal("window", {
    location: new URL("https://www.k53studyguide.online/app/"),
    sessionStorage: {
      getItem: (key: string) => values.get(key),
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  vi.stubGlobal(
    "__FIREBASE_WEB_CONFIG__",
    JSON.stringify({ apiKey: "fixture", projectId: "fixture", appId: "fixture", measurementId: "G-FIXTURE" }),
  );
  vi.stubGlobal("__WEB_ANALYTICS__", "production");
});
afterEach(() => vi.unstubAllGlobals());

it("initializes Firebase before free web activity reaches the collector", async () => {
  const { analytics } = await import("./index");
  analytics.trackAppOpen({ language: "en", theme: "dark", premium_status: "premium" });
  await vi.waitFor(() => expect(sdk.initializeApp).toHaveBeenCalledOnce());
  await vi.waitFor(() =>
    expect(sdk.logEvent).toHaveBeenCalledWith({
      name: "app_open",
      params: {
        language: "en",
        theme: "dark",
        premium_status: "free",
        analytics_schema_version: "v2",
        analytics_test: "false",
      },
    }),
  );
  expect(sdk.initializeAnalytics).toHaveBeenCalledWith({ name: "[DEFAULT]" }, { config: { send_page_view: false } });
});

it.each([
  ["https://k53studyguide.online/app/", "production", true, true],
  ["https://www.k53studyguide.online/app/", "", true, false],
  ["http://localhost:3000/app/", "production", true, false],
  ["https://preview.example.com/app/", "production", true, false],
  ["https://www.k53studyguide.online/staging/", "production", true, false],
  ["https://www.k53studyguide.online/app-preview/", "production", true, false],
  ["https://www.k53studyguide.online/app/", "production", false, false],
  ["https://www.k53studyguide.online/app-preview/?analytics_test=true", "", true, true],
  ["http://localhost:3000/app/?utm_source=qa", "", true, true],
])("gates collection at %s with flag=%s config=%s", async (url, flag, config, enabled) => {
  Object.assign(window, { location: new URL(url) });
  vi.stubGlobal("__WEB_ANALYTICS__", flag);
  if (!config) vi.stubGlobal("__FIREBASE_WEB_CONFIG__", "");
  const { isWebCollectionEnabled } = await import("./collection");
  const { analytics } = await import("./index");
  expect(isWebCollectionEnabled()).toBe(enabled);
  analytics.logEvent("app_open");
  if (enabled) await vi.waitFor(() => expect(sdk.logEvent).toHaveBeenCalledOnce());
  else {
    expect(sdk.initializeApp).not.toHaveBeenCalled();
    expect(sdk.logEvent).not.toHaveBeenCalled();
  }
});

it("keeps QA tagged through navigation and reload", async () => {
  Object.assign(window, { location: new URL("https://www.k53studyguide.online/app-preview/?analytics_test=true") });
  let module = await import("./index");
  module.analytics.logEvent("app_open");
  await vi.waitFor(() => expect(sdk.logEvent).toHaveBeenCalledOnce());
  Object.assign(window, { location: new URL("https://www.k53studyguide.online/app-preview/quiz") });
  vi.resetModules();
  module = await import("./index");
  module.analytics.logEvent("quiz_start");
  await vi.waitFor(() => expect(sdk.logEvent).toHaveBeenCalledTimes(2));
  expect(sdk.logEvent.mock.calls.every(([event]) => event.params.analytics_test === "true")).toBe(true);
});

it("suppresses purchase-family events and coerces free web user properties", async () => {
  const { analytics } = await import("./index");
  for (const name of [
    "premium_invitation_view",
    "premium_invitation_tap",
    "premium_offer_close",
    "view_promotion",
    "select_promotion",
    "begin_checkout",
    "checkout_outcome",
    "restore_start",
    "restore_outcome",
    "purchase_pending",
    "purchase_cancel",
    "purchase_error",
    "purchase_unavailable",
    "purchase_initialization_error",
    "PRESENT_OFFER",
  ] as const)
    analytics.logEvent(name);
  expect(sdk.logEvent).not.toHaveBeenCalled();
  expect(sdk.initializeApp).not.toHaveBeenCalled();
  analytics.setUserProperties({ premium_status: "premium", language: "af" });
  await vi.waitFor(() => expect(sdk.setUserProperty).toHaveBeenCalledWith({ key: "language", value: "af" }));
  expect(sdk.setUserProperty).not.toHaveBeenCalledWith({ key: "premium_status", value: "premium" });
  expect(sdk.setUserProperty).toHaveBeenCalledWith({ key: "premium_status", value: "free" });
});

it("maps web screens to tagged screen_view events and swallows delivery failures", async () => {
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  const { analytics } = await import("./index");
  sdk.logEvent.mockRejectedValueOnce(new Error("Blocked tracker"));
  expect(() => analytics.setCurrentScreen("QuizPage")).not.toThrow();
  await vi.waitFor(() =>
    expect(sdk.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "screen_view",
        params: expect.objectContaining({ firebase_screen: "QuizPage", premium_status: "free" }),
      }),
    ),
  );
  await vi.waitFor(() => expect(warning).toHaveBeenCalled());
  warning.mockRestore();
});

it("does not send activity when Firebase initialization throws", async () => {
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  sdk.initializeApp.mockImplementationOnce(() => {
    throw new Error("Missing capability");
  });
  const { analytics } = await import("./index");
  expect(() => analytics.logEvent("quiz_start")).not.toThrow();
  await vi.waitFor(() => expect(warning).toHaveBeenCalled());
  expect(sdk.logEvent).not.toHaveBeenCalled();
  warning.mockRestore();
});

it("keeps explicit QA collection usable when browser session storage is blocked", async () => {
  Object.assign(window, { location: new URL("https://www.k53studyguide.online/app-preview/?analytics_test=true") });
  window.sessionStorage.setItem = () => {
    throw new Error("Storage blocked");
  };
  const { analytics } = await import("./index");
  expect(() => analytics.logEvent("app_open")).not.toThrow();
  await vi.waitFor(() =>
    expect(sdk.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ params: expect.objectContaining({ analytics_test: "true" }) }),
    ),
  );
});
