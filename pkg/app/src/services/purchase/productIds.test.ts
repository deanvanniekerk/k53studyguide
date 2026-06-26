import { describe, expect, it } from "vitest";
import { ANDROID_PREMIUM_PRODUCT_ID, getPremiumProductId, IOS_PREMIUM_PRODUCT_ID } from "./productIds";

describe("purchase product ids", () => {
  it("keeps Android on the existing Google Play product id", () => {
    expect(getPremiumProductId(false)).toBe(ANDROID_PREMIUM_PRODUCT_ID);
  });

  it("uses the iOS-only product id for App Store purchases", () => {
    expect(getPremiumProductId(true)).toBe(IOS_PREMIUM_PRODUCT_ID);
  });
});
