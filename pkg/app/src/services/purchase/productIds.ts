const APPLE_APPSTORE_PLATFORM = "ios-appstore";
const IOS_DEVICE_PLATFORM = "iOS";

export const ANDROID_PREMIUM_PRODUCT_ID = "premium_access";
export const IOS_PREMIUM_PRODUCT_ID = "deanvniekerk.k53studyguide.premium_access";
export const DEFAULT_PREMIUM_PRODUCT_ID = ANDROID_PREMIUM_PRODUCT_ID;

export const getPremiumProductIdForStorePlatform = (platform?: string) => {
  return platform === APPLE_APPSTORE_PLATFORM ? IOS_PREMIUM_PRODUCT_ID : ANDROID_PREMIUM_PRODUCT_ID;
};

export const getPremiumProductIdForDevicePlatform = (platform?: string) => {
  return platform === IOS_DEVICE_PLATFORM ? IOS_PREMIUM_PRODUCT_ID : ANDROID_PREMIUM_PRODUCT_ID;
};
