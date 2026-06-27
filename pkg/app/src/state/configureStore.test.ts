import { shouldUseRevenueCatPurchaseService } from "./configureStore";

describe("configureStore", () => {
  it("keeps local web on the mocked purchase service", () => {
    expect(shouldUseRevenueCatPurchaseService("production", "web")).toBe(false);
  });

  it("uses RevenueCat only for production native platforms", () => {
    expect(shouldUseRevenueCatPurchaseService("production", "ios")).toBe(true);
    expect(shouldUseRevenueCatPurchaseService("production", "android")).toBe(true);
    expect(shouldUseRevenueCatPurchaseService("development", "ios")).toBe(false);
  });
});
