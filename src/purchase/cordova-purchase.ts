import { Purchase, RegisterProduct } from "./types";

const registerProduct: RegisterProduct = () => {
    store.register({
        id: "premium_1_year",
        alias: "1 Year Premium Subscription",
        type: store.NON_RENEWING_SUBSCRIPTION,
    });
};

const purchase: Purchase = {
    registerProduct,
};

export default purchase;
