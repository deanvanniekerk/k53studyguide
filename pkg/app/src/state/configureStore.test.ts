import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { FreeWebAccessService } from "@/services/purchase/FreeWebAccessService";
import { LocalPurchaseService } from "@/services/purchase/LocalPurchaseService";
import { RevenueCatPurchaseService } from "@/services/purchase/RevenueCatPurchaseService";
import { configureStore, shouldUseRevenueCatPurchaseService } from "./configureStore";

vi.mock("@capacitor/core", async (original) => ({
  ...(await original<object>()),
  Capacitor: { getPlatform: vi.fn(() => "web") },
}));
vi.mock("@capacitor/preferences", () => ({ Preferences: { get: vi.fn(), set: vi.fn(), remove: vi.fn() } }));

beforeEach(() => {
  vi.stubGlobal("__ENVIRONMENT__", "production");
  vi.mocked(Preferences.get).mockResolvedValue({ value: null });
  vi.mocked(Preferences.set).mockResolvedValue();
});
afterEach(() => vi.unstubAllGlobals());

it.each([
  ["production", "web", FreeWebAccessService],
  ["production", "ios", RevenueCatPurchaseService],
  ["production", "android", RevenueCatPurchaseService],
  ["development", "web", LocalPurchaseService],
  ["development", "ios", LocalPurchaseService],
])("selects safe billing for %s on %s", (environment, platform, Service) => {
  vi.stubGlobal("__ENVIRONMENT__", environment);
  vi.mocked(Capacitor.getPlatform).mockReturnValue(platform);
  const { purchaseService, persistor } = configureStore();
  expect(purchaseService).toBeInstanceOf(Service);
  expect(shouldUseRevenueCatPurchaseService(environment, platform)).toBe(Service === RevenueCatPurchaseService);
  persistor.pause();
});

it("clears a stale browser purchase after rehydration without granting paid ownership", async () => {
  vi.mocked(Capacitor.getPlatform).mockReturnValue("web");
  vi.mocked(Preferences.get).mockImplementation(async ({ key }) => ({
    value: key === "persist:purchase" ? JSON.stringify({ owned: "true", canPurchase: "true" }) : null,
  }));
  const { store, purchaseService, persistor } = configureStore();
  await new Promise<void>((resolve) => {
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
  });
  await purchaseService.initialize();
  expect(store.getState().access.model).toBe("free_web");
  expect(store.getState().purchase).toMatchObject({ owned: false, canPurchase: false, availability: "idle" });
  purchaseService.purchase();
  await purchaseService.restore();
  expect(store.getState().purchase.owned).toBe(false);
  persistor.pause();
});
