import { Capacitor } from "@capacitor/core";
import {
  type CustomerInfo,
  LOG_LEVEL,
  PRODUCT_CATEGORY,
  PURCHASES_ERROR_CODE,
  Purchases,
  type PurchasesError,
  type PurchasesStoreProduct,
} from "@revenuecat/purchases-capacitor";
import { analytics } from "@/services/analytics";
import { recieveLogMessage } from "@/state/log";
import {
  recievePurchaseOrderState,
  recievePurchaseProduct,
  recievePurchaseProductCanPurchase,
  recievePurchaseProductOwned,
} from "@/state/purchase";
import type { LogData, LogLevel } from "..";
import { DEFAULT_PREMIUM_PRODUCT_ID, getPremiumProductId, REVENUECAT_PREMIUM_ENTITLEMENT_ID } from "./productIds";
import type { PurchaseService, PurchaseStore } from "./types";

type PurchaseStateSnapshot = {
  purchase?: {
    owned?: boolean;
  };
};

const getRevenueCatApiKey = (platform: string) => {
  if (platform === "ios") return __REVENUECAT_IOS_API_KEY__;
  if (platform === "android") return __REVENUECAT_ANDROID_API_KEY__;
  return "";
};

export class RevenueCatPurchaseService implements PurchaseService {
  private readonly _reduxStore: PurchaseStore;
  private _productId = DEFAULT_PREMIUM_PRODUCT_ID;
  private _product?: PurchasesStoreProduct;
  private _initializePromise?: Promise<void>;

  constructor(reduxStore: PurchaseStore) {
    this._reduxStore = reduxStore;
  }

  get productId() {
    return this._productId;
  }

  async initialize() {
    if (!this._initializePromise) this._initializePromise = this.initializeRevenueCat();
    await this._initializePromise;
  }

  async purchase() {
    await this.initialize();

    if (!this._product) {
      this.log("ERROR", "RevenueCatPurchaseService > purchase > product unavailable", {
        productId: this._productId,
      });
      this._reduxStore.dispatch(recievePurchaseOrderState("error"));
      return;
    }

    this.log("INFO", "RevenueCatPurchaseService > ordering product");
    analytics.trackBeginCheckout(this.getAnalyticsPurchaseParams());
    this._reduxStore.dispatch(recievePurchaseOrderState("pending"));
    analytics.trackPurchaseState("pending", this.getAnalyticsPurchaseParams());

    try {
      const { customerInfo } = await Purchases.purchaseStoreProduct({ product: this._product });
      const hasFullAccess = this.applyCustomerInfo(customerInfo);
      const orderState = hasFullAccess ? "finished" : "error";
      this._reduxStore.dispatch(recievePurchaseOrderState(orderState));
      analytics.trackPurchaseState(orderState, this.getAnalyticsPurchaseParams());
    } catch (error) {
      const purchaseError = toPurchasesError(error);
      const orderState =
        purchaseError?.userCancelled || purchaseError?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
          ? "cancelled"
          : "error";

      this.log("ERROR", "RevenueCatPurchaseService > purchase > error", {
        code: purchaseError?.code ?? "unknown",
        message: purchaseError?.message ?? String(error),
      });
      this._reduxStore.dispatch(recievePurchaseOrderState(orderState));
      analytics.trackPurchaseState(orderState, this.getAnalyticsPurchaseParams());
    }
  }

  async restore() {
    await this.initialize();

    this.log("INFO", "RevenueCatPurchaseService > restoring purchases");
    this._reduxStore.dispatch(recievePurchaseOrderState("pending"));

    try {
      const { customerInfo } = await Purchases.restorePurchases();
      const hasFullAccess = this.applyCustomerInfo(customerInfo);
      this._reduxStore.dispatch(recievePurchaseOrderState(hasFullAccess ? "ready" : "error"));

      if (!hasFullAccess) {
        this.log("INFO", "RevenueCatPurchaseService > restore > no purchase restored", {
          productId: this._productId,
        });
      }
    } catch (error) {
      const purchaseError = toPurchasesError(error);
      this.log("ERROR", "RevenueCatPurchaseService > restore > error", {
        code: purchaseError?.code ?? "unknown",
        message: purchaseError?.message ?? String(error),
      });
      this._reduxStore.dispatch(recievePurchaseOrderState("error"));
    }
  }

  log(level: LogLevel, message: string, data?: LogData) {
    const action = recieveLogMessage(level, message, data);

    this._reduxStore.dispatch(action);
  }

  private async initializeRevenueCat() {
    const platform = Capacitor.getPlatform();
    this._productId = getPremiumProductId(platform === "ios");
    const apiKey = getRevenueCatApiKey(platform);
    const hasLegacyFullAccess = this.hasPersistedFullAccess();

    this.log("INFO", "RevenueCatPurchaseService > initialize", {
      productId: this._productId,
      platform,
      entitlement: REVENUECAT_PREMIUM_ENTITLEMENT_ID,
    });

    if (!apiKey) {
      this.log("ERROR", "RevenueCatPurchaseService > initialize > missing RevenueCat API key", { platform });
      this._reduxStore.dispatch(recievePurchaseProductCanPurchase(false));
      return;
    }

    try {
      await Purchases.configure({ apiKey });
      await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
      await Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        this.applyCustomerInfo(customerInfo);
      });

      const [{ products }, { customerInfo }] = await Promise.all([
        Purchases.getProducts({
          productIdentifiers: [this._productId],
          type: PRODUCT_CATEGORY.NON_SUBSCRIPTION,
        }),
        Purchases.getCustomerInfo(),
      ]);

      const product = products.find((candidate) => candidate.identifier === this._productId);
      if (!product) {
        this.log("ERROR", "RevenueCatPurchaseService > initialize > product unavailable", {
          productId: this._productId,
        });
        this._reduxStore.dispatch(recievePurchaseProductCanPurchase(false));
        return;
      }

      this._product = product;
      this._reduxStore.dispatch(recievePurchaseProduct(product.priceString, product.title, product.description));
      await this.applyCustomerInfoWithLegacySync(customerInfo, hasLegacyFullAccess);
    } catch (error) {
      const purchaseError = toPurchasesError(error);
      this.log("ERROR", "RevenueCatPurchaseService > initialize > error", {
        code: purchaseError?.code ?? "unknown",
        message: purchaseError?.message ?? String(error),
      });
      this._reduxStore.dispatch(recievePurchaseProductCanPurchase(false));
    }
  }

  private applyCustomerInfo(customerInfo: CustomerInfo) {
    const hasFullAccess = this.hasFullAccess(customerInfo);

    this._reduxStore.dispatch(recievePurchaseProductOwned(hasFullAccess));
    this._reduxStore.dispatch(recievePurchaseProductCanPurchase(Boolean(this._product) && !hasFullAccess));

    return hasFullAccess;
  }

  private async applyCustomerInfoWithLegacySync(customerInfo: CustomerInfo, hasLegacyFullAccess: boolean) {
    const hasRevenueCatFullAccess = this.hasFullAccess(customerInfo);
    if (hasRevenueCatFullAccess || !hasLegacyFullAccess) return this.applyCustomerInfo(customerInfo);

    try {
      this.log("INFO", "RevenueCatPurchaseService > initialize > syncing legacy purchase");
      await Purchases.syncPurchases();
      const { customerInfo: syncedCustomerInfo } = await Purchases.getCustomerInfo();
      return this.applyCustomerInfo(syncedCustomerInfo);
    } catch (error) {
      const purchaseError = toPurchasesError(error);
      this.log("ERROR", "RevenueCatPurchaseService > initialize > legacy purchase sync failed", {
        code: purchaseError?.code ?? "unknown",
        message: purchaseError?.message ?? String(error),
      });

      // Preserve existing paid users if store sync cannot run during the RevenueCat migration.
      this._reduxStore.dispatch(recievePurchaseProductOwned(true));
      this._reduxStore.dispatch(recievePurchaseProductCanPurchase(false));
      return true;
    }
  }

  private hasFullAccess(customerInfo: CustomerInfo) {
    return Boolean(customerInfo.entitlements.active[REVENUECAT_PREMIUM_ENTITLEMENT_ID]?.isActive);
  }

  private hasPersistedFullAccess() {
    const state = this._reduxStore.getState() as PurchaseStateSnapshot;
    return Boolean(state.purchase?.owned);
  }

  private getAnalyticsPurchaseParams() {
    return {
      product_id: this._productId,
      price: this._product?.priceString,
      currency: this._product?.currencyCode ?? "ZAR",
      value: this._product?.price,
    };
  }
}

const toPurchasesError = (error: unknown): PurchasesError | undefined => {
  if (typeof error !== "object" || error === null) return undefined;

  const candidate = error as Partial<PurchasesError>;
  if (!candidate.code && !candidate.message) return undefined;

  return candidate as PurchasesError;
};
