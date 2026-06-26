export const ANDROID_PREMIUM_PRODUCT_ID = "premium_access";
export const IOS_PREMIUM_PRODUCT_ID = "deanvniekerk.k53studyguide.premium_access";
export const DEFAULT_PREMIUM_PRODUCT_ID = ANDROID_PREMIUM_PRODUCT_ID;
export const REVENUECAT_PREMIUM_ENTITLEMENT_ID = "premium_access";

export const getPremiumProductId = (isAppleAppStore: boolean) => {
  return isAppleAppStore ? IOS_PREMIUM_PRODUCT_ID : ANDROID_PREMIUM_PRODUCT_ID;
};
