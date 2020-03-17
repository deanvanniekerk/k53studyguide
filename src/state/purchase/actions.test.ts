import * as actions from "./actions";

describe("state > purchase > actions", () => {
    it("recievePurchaseStatus", () => {
        const expectedAction = {
            type: "PURCHASE_RECIEVE_STATUS",
            payload: {
                canPurchase: true,
                status: "wow wow wow wow",
            },
        };

        expect(actions.recievePurchaseStatus(true, "wow wow wow wow")).toEqual(expectedAction);
    });

    it("recievePurchaseOrderStatus", () => {
        const expectedAction = {
            type: "PURCHASE_RECIEVE_ORDER_STATUS",
            payload: "failed",
        };

        expect(actions.recievePurchaseOrderStatus("failed")).toEqual(expectedAction);
    });

    it("recievePurchaseProduct", () => {
        const expectedAction = {
            type: "PURCHASE_RECIEVE_PRODUCT",
            payload: {
                title: "title",
                description: "description",
                price: "R25",
            },
        };

        expect(actions.recievePurchaseProduct("R25", "title", "description")).toEqual(
            expectedAction
        );
    });

    it("recievePurchaseOwned", () => {
        const now = new Date();
        const expectedAction = {
            type: "PURCHASE_RECIEVE_OWNED",
            payload: {
                owned: true,
                purchaseDate: now.toISOString(),
            },
        };

        expect(actions.recievePurchaseOwned(true, now.toISOString())).toEqual(expectedAction);
    });
});
