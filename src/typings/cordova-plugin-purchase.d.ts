declare const store: store.Store;

declare namespace store {
    export type StoreProductType =
        | "consumable"
        | "non consumable"
        | "free subscription"
        | "paid subscription";

    export interface Error {
        code: number;
        message: string;
    }

    export interface When {
        approved(callback: (product: StoreProduct) => void): When;
        error(callback: (err: IError, product: StoreProduct) => void): When;
        loaded(callback: (product: StoreProduct) => void): When;
        updated(callback: (product: StoreProduct) => void): When;
        owned(callback: (product: StoreProduct) => void): When;
        cancelled(callback: (product: StoreProduct) => void): When;
        refunded(callback: (product: StoreProduct) => void): When;
        verified(callback: (product: StoreProduct) => void): When;
        unverified(callback: (product: StoreProduct) => void): When;
        downloading(
            callback: (product: StoreProduct, progress: number, timeRemaining: number) => void
        ): When;
        downloaded(callback: (product: StoreProduct) => void): When;
    }

    export interface ValidatorCallback {
        (success: boolean, data: never): void;
    }

    export interface Validator {
        (product: StoreProduct, callback: ValidatorCallback): void;
    }

    export interface Store {
        NON_CONSUMABLE: StoreProductType;
        PAID_SUBSCRIPTION: StoreProductType;
        NON_RENEWING_SUBSCRIPTION: StoreProductType;
        DEBUG: number;

        ERR_PURCHASE: number;

        verbosity: number | boolean;
        validator: string | IValidator;

        error(callback: (err: IError) => void): void;
        get(id: string): StoreProduct;
        once(query: string, action: string, callback: () => void): void;
        register(request: IRegisterRequest): void;
        when(query: string): IWhen;
        when(action: string, query: string, callback: (product: StoreProduct) => void): IWhen;
        ready(callback: () => void): void;
        refresh(): void;
        off(callback: Function): void;
        order(id: string): void;
    }

    export type TransactionType = "ios-appstore" | "android-playstore";
    export type StoreProductState =
        | "approved"
        | "cancelled"
        | "downloading"
        | "downloaded"
        | "expired"
        | "finished"
        | "initiated"
        | "invalid"
        | "owned"
        | "registered"
        | "requested"
        | "valid";

    export interface Transaction {
        id: string;
        // Android only
        type: TransactionType;
        developerPayload?: string;
        purchaseToken?: string;
        receipt?: string;
        // iOS only
        appStoreReceipt?: string;
        transactionReceipt?: string;
    }

    export interface RegisterRequest {
        id: string;
        alias: string;
        type: StoreProductType;
    }

    export interface StoreProduct extends RegisterRequest {
        canPurchase: boolean;
        currency: string;
        description: string;
        downloading: boolean;
        downloaded: boolean;
        finish: () => void;
        loaded: string | boolean;
        owned: boolean;
        price: string;
        state: StoreProductState;
        title: string;
        transaction: ITransaction;
        valid: boolean;
        verify: () => void;
    }
}
