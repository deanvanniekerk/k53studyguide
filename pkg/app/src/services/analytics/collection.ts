import { Capacitor } from "@capacitor/core";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import type { FirebaseOptions } from "firebase/app";

type Params = Record<string, string | number>;
const web = Capacitor.getPlatform() === "web";
const qaKey = "k53.analytics-test";

function policy() {
  if (!web || typeof window === "undefined") return { enabled: false, qa: false, config: undefined };
  const query = new URLSearchParams(window.location.search);
  let qa = query.get("analytics_test") === "true" || query.get("utm_source") === "qa";
  try {
    qa ||= window.sessionStorage.getItem(qaKey) === "true";
    if (qa) window.sessionStorage.setItem(qaKey, "true");
  } catch {
    /* Collection and studying do not require writable storage. */
  }
  let config: FirebaseOptions | undefined;
  try {
    const candidate = JSON.parse(typeof __FIREBASE_WEB_CONFIG__ === "undefined" ? "" : __FIREBASE_WEB_CONFIG__);
    if (
      [candidate.apiKey, candidate.projectId, candidate.appId, candidate.measurementId].every(
        (value) => typeof value === "string" && value.length > 0,
      )
    )
      config = candidate;
  } catch {
    /* Missing/malformed config suppresses collection. */
  }
  const production = typeof __WEB_ANALYTICS__ !== "undefined" && __WEB_ANALYTICS__ === "production";
  const host = ["www.k53studyguide.online", "k53studyguide.online"].includes(window.location.hostname);
  const preview =
    import.meta.env.BASE_URL.startsWith("/app-preview/") || window.location.pathname.startsWith("/app-preview/");
  return {
    config,
    qa,
    enabled: Boolean(
      config && (qa || (production && host && window.location.pathname.startsWith("/app/") && !preview)),
    ),
  };
}
const context = policy();
export const isWebCollectionEnabled = () => web && context.enabled;
const tags = (): Params => ({
  premium_status: "free",
  analytics_schema_version: "v2",
  analytics_test: context.qa ? "true" : "false",
});
let initialization: Promise<boolean> | undefined;

function safe(operation: () => Promise<void> | void) {
  try {
    void Promise.resolve(operation()).catch((error) => console.warn("Firebase analytics call failed", error));
  } catch (error) {
    console.warn("Firebase analytics call failed", error);
  }
}
async function initializeWeb() {
  try {
    if (!context.config) return false;
    const { getApps, initializeApp } = await import("firebase/app");
    const existing = getApps().find((app) => app.name === "[DEFAULT]");
    if (existing && existing.options.projectId !== context.config?.projectId)
      throw new Error("Firebase project mismatch");
    const app = existing ?? initializeApp(context.config);
    const { initializeAnalytics } = await import("firebase/analytics");
    // Route screen_view events own navigation measurement; avoid an untagged auto page_view.
    initializeAnalytics(app, { config: { send_page_view: false, ...(context.qa ? { debug_mode: true } : {}) } });
    await FirebaseAnalytics.setUserProperty({ key: "analytics_test", value: context.qa ? "true" : "false" });
    await FirebaseAnalytics.setUserProperty({ key: "premium_status", value: "free" });
    return true;
  } catch {
    console.warn("Firebase web analytics initialization failed; studying remains available");
    return false;
  }
}
function send(operation: () => Promise<void> | void) {
  if (!web) {
    safe(operation);
    return;
  }
  if (!isWebCollectionEnabled()) return;
  initialization ??= initializeWeb();
  void initialization.then((ready) => {
    if (ready) safe(operation);
  });
}
const purchaseSignal =
  /^(premium_invitation_|premium_offer_|view_promotion$|select_promotion$|begin_checkout$|checkout_outcome$|restore_|purchase(?:_|$)|in_app_purchase$|PRESENT_OFFER$)/;

/** One collector interface keeps host/config policy, startup and native delivery together. */
export const analyticsCollector = {
  logEvent(name: string, params?: Params) {
    if (web && purchaseSignal.test(name)) return;
    const values = web ? { ...params, ...tags() } : params;
    if (web && !isWebCollectionEnabled()) {
      if (import.meta.env.DEV) console.info("[Analytics preview]", name, values);
      return;
    }
    send(() => FirebaseAnalytics.logEvent({ name, ...(values ? { params: values } : {}) }));
  },
  setCurrentScreen(screenName: string) {
    if (web) this.logEvent("screen_view", { firebase_screen: screenName });
    else send(() => FirebaseAnalytics.setCurrentScreen({ screenName }));
  },
  setUserProperties(properties: Record<string, string | undefined>) {
    const values = web
      ? { ...properties, premium_status: "free", analytics_test: context.qa ? "true" : "false" }
      : properties;
    for (const [key, value] of Object.entries(values))
      if (value) send(() => FirebaseAnalytics.setUserProperty({ key, value }));
  },
};
