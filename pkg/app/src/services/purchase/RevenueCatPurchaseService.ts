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
import { v4 as uuid } from "uuid";
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
import type { OfferOrigin, PurchaseService, PurchaseStore } from "./types";

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

  offerOpened(origin: OfferOrigin) {
    let open = true;
    void this.initialize().then(() => {
      if (!open) return;
      analytics.trackPromotionView({
        ...this.getAnalyticsPurchaseParams(),
        offer_origin: origin,
        offer_surface: "purchase_modal",
        availability: this._product ? "available" : "unavailable",
        eligibility: this.hasPersistedFullAccess() ? "owned" : this._product ? "eligible" : "unavailable",
      });
    });
    return () => {
      open = false;
    };
  }

  async purchase(origin?: OfferOrigin) {
    await this.initialize();
    const params = { ...this.getAnalyticsPurchaseParams(), offer_origin: origin ?? "unknown", attempt_id: uuid() };

    if (!this._product) {
      analytics.logEvent("purchase_unavailable", { ...params, availability: "unavailable" });
      this.log("ERROR", "RevenueCatPurchaseService > purchase > product unavailable", {
        productId: this._productId,
      });
      this._reduxStore.dispatch(recievePurchaseOrderState("error"));
      return;
    }

    this.log("INFO", "RevenueCatPurchaseService > ordering product");
    analytics.trackBeginCheckout(params);
    this._reduxStore.dispatch(recievePurchaseOrderState("pending"));

    try {
      const { customerInfo } = await Purchases.purchaseStoreProduct({ product: this._product });
      const hasFullAccess = this.applyCustomerInfo(customerInfo);
      const orderState = hasFullAccess ? "finished" : "error";
      this._reduxStore.dispatch(recievePurchaseOrderState(orderState));
      analytics.trackPurchaseState(orderState, {
        ...params,
        transaction_environment: this.transactionEnvironment(customerInfo),
      });
    } catch (error) {
      const purchaseError = toPurchasesError(error);
      const orderState =
        purchaseError?.userCancelled || purchaseError?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
          ? "cancelled"
          : purchaseError?.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR
            ? "pending"
            : "error";

      this.log("ERROR", "RevenueCatPurchaseService > purchase > error", {
        code: purchaseError?.code ?? "unknown",
        message: purchaseError?.message ?? String(error),
      });
      // Keep the existing error presentation until the pending-payment UX in #14 is implemented.
      // Redux pending means an in-flight spinner, not a deferred store transaction.
      this._reduxStore.dispatch(recievePurchaseOrderState(orderState === "pending" ? "error" : orderState));
      if (purchaseError?.code === PURCHASES_ERROR_CODE.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR) {
        analytics.logEvent("purchase_unavailable", {
          ...params,
          availability: "unavailable",
          error_code: purchaseError.code,
        });
      } else {
        analytics.trackPurchaseState(orderState, { ...params, error_code: purchaseError?.code ?? "unknown" });
      }
    }
  }

  async restore(origin?: OfferOrigin) {
    await this.initialize();
    const params = { ...this.getAnalyticsPurchaseParams(), offer_origin: origin ?? "unknown", attempt_id: uuid() };
    analytics.logEvent("restore_start", params);

    this.log("INFO", "RevenueCatPurchaseService > restoring purchases");
    this._reduxStore.dispatch(recievePurchaseOrderState("pending"));

    try {
      const { customerInfo } = await Purchases.restorePurchases();
      const hasFullAccess = this.applyCustomerInfo(customerInfo);
      this._reduxStore.dispatch(recievePurchaseOrderState(hasFullAccess ? "ready" : "error"));
      analytics.logEvent("restore_outcome", {
        ...params,
        outcome: hasFullAccess ? "access_restored" : "no_entitlement",
        transaction_environment: this.transactionEnvironment(customerInfo),
      });

      if (!hasFullAccess) {
        this.log("INFO", "RevenueCatPurchaseService > restore > no purchase restored", {
          productId: this._productId,
        });
      }
    } catch (error) {
      const purchaseError = toPurchasesError(error);
      analytics.logEvent("restore_outcome", {
        ...params,
        outcome: "error",
        error_code: purchaseError?.code ?? "unknown",
      });
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
      apiKeyPrefix: apiKey ? `${apiKey.split("_")[0]}_` : "(empty)",
      apiKeyLength: String(apiKey.length),
    });

    if (!apiKey) {
      this.log("ERROR", "RevenueCatPurchaseService > initialize > missing RevenueCat API key", { platform });
      analytics.logEvent("purchase_initialization_error", {
        ...this.getAnalyticsPurchaseParams(),
        failure_reason: "missing_api_key",
      });
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

      this.log("INFO", "RevenueCatPurchaseService > initialize > products fetched", {
        requested: this._productId,
        returnedCount: String(products.length),
        returnedIds: products.map((candidate) => candidate.identifier).join(", ") || "(none)",
      });
      this.logCustomerInfoDiagnostics(customerInfo, "initialize");
      await this.logOfferingsDiagnostics();

      const product = products.find((candidate) => candidate.identifier === this._productId);
      if (!product) {
        analytics.logEvent("purchase_initialization_error", {
          ...this.getAnalyticsPurchaseParams(),
          failure_reason: "product_unavailable",
        });
        this.log("ERROR", "RevenueCatPurchaseService > initialize > product unavailable", {
          productId: this._productId,
          returnedCount: String(products.length),
          returnedIds: products.map((candidate) => candidate.identifier).join(", ") || "(none)",
        });
        this._reduxStore.dispatch(recievePurchaseProductCanPurchase(false));
        return;
      }

      this.log("INFO", "RevenueCatPurchaseService > initialize > product available", {
        identifier: product.identifier,
        price: product.priceString,
        currency: product.currencyCode ?? "(none)",
        title: product.title,
      });

      this._product = product;
      this._reduxStore.dispatch(recievePurchaseProduct(product.priceString, product.title, product.description));
      await this.applyCustomerInfoWithLegacySync(customerInfo, hasLegacyFullAccess);
    } catch (error) {
      const purchaseError = toPurchasesError(error);
      this.log("ERROR", "RevenueCatPurchaseService > initialize > error", {
        code: purchaseError?.code ?? "unknown",
        message: purchaseError?.message ?? String(error),
      });
      analytics.logEvent("purchase_initialization_error", {
        ...this.getAnalyticsPurchaseParams(),
        failure_reason: "sdk_error",
        error_code: purchaseError?.code ?? "unknown",
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

  private logCustomerInfoDiagnostics(customerInfo: CustomerInfo, context: string) {
    // Diagnostics must never break the purchase flow, so guard against partial customer info.
    try {
      this.log("INFO", "RevenueCatPurchaseService > customer info", {
        context,
        appUserId: customerInfo.originalAppUserId ?? "(none)",
        activeEntitlements: Object.keys(customerInfo.entitlements?.active ?? {}).join(", ") || "(none)",
        allEntitlements: Object.keys(customerInfo.entitlements?.all ?? {}).join(", ") || "(none)",
        activeSubscriptions: (customerInfo.activeSubscriptions ?? []).join(", ") || "(none)",
        nonSubscriptionTransactions: String((customerInfo.nonSubscriptionTransactions ?? []).length),
        hasPremiumEntitlement: String(this.hasFullAccess(customerInfo)),
      });
    } catch (error) {
      this.log("ERROR", "RevenueCatPurchaseService > customer info > diagnostics failed", {
        message: String(error),
      });
    }
  }

  private async logOfferingsDiagnostics() {
    try {
      const offerings = await Purchases.getOfferings();
      const currentPackages = offerings.current?.availablePackages ?? [];

      this.log("INFO", "RevenueCatPurchaseService > offerings", {
        currentOffering: offerings.current?.identifier ?? "(none)",
        allOfferings: Object.keys(offerings.all).join(", ") || "(none)",
        currentPackageProducts: currentPackages.map((pkg) => pkg.product.identifier).join(", ") || "(none)",
      });
    } catch (error) {
      const purchaseError = toPurchasesError(error);
      this.log("ERROR", "RevenueCatPurchaseService > offerings > error", {
        code: purchaseError?.code ?? "unknown",
        message: purchaseError?.message ?? String(error),
      });
    }
  }

  private hasFullAccess(customerInfo: CustomerInfo) {
    return Boolean(customerInfo.entitlements.active[REVENUECAT_PREMIUM_ENTITLEMENT_ID]?.isActive);
  }

  private hasPersistedFullAccess() {
    const state = this._reduxStore.getState() as PurchaseStateSnapshot;
    return Boolean(state.purchase?.owned);
  }

  private transactionEnvironment(customerInfo: CustomerInfo): "sandbox" | "production" | "unknown" {
    const isSandbox = customerInfo.entitlements.active[REVENUECAT_PREMIUM_ENTITLEMENT_ID]?.isSandbox;
    return typeof isSandbox === "boolean" ? (isSandbox ? "sandbox" : "production") : "unknown";
  }

  private getAnalyticsPurchaseParams() {
    return {
      execution_context: __ENVIRONMENT__,
      transaction_environment: "unknown" as const,
      product_id: this._productId,
      price: this._product?.priceString,
      currency: this._product?.currencyCode,
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
