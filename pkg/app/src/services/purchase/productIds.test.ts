import { describe, expect, it } from "vitest";
import {
  ANDROID_PREMIUM_PRODUCT_ID,
  getPremiumProductIdForDevicePlatform,
  getPremiumProductIdForStorePlatform,
  IOS_PREMIUM_PRODUCT_ID,
} from "./productIds";

describe("purchase product ids", () => {
  it("keeps Android on the existing Google Play product id", () => {
    expect(getPremiumProductIdForStorePlatform("android-playstore")).toBe(ANDROID_PREMIUM_PRODUCT_ID);
    expect(getPremiumProductIdForDevicePlatform("Android")).toBe(ANDROID_PREMIUM_PRODUCT_ID);
  });

  it("uses the iOS-only product id for App Store purchases", () => {
    expect(getPremiumProductIdForStorePlatform("ios-appstore")).toBe(IOS_PREMIUM_PRODUCT_ID);
    expect(getPremiumProductIdForDevicePlatform("iOS")).toBe(IOS_PREMIUM_PRODUCT_ID);
  });
});
