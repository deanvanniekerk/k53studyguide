import * as actions from "./actions";

describe("state > purchase > actions", () => {
    it("recievePurchaseProductState", () => {
        const expectedAction = {
            type: "PURCHASE_RECIEVE_PRODUCT_STATE",
            payload: {
                canPurchase: true,
                productState: "registered",
            },
        };

        expect(actions.recievePurchaseProductState(true, "registered")).toEqual(expectedAction);
    });

    it("recievePurchaseOrderState", () => {
        const expectedAction = {
            type: "PURCHASE_RECIEVE_ORDER_STATE",
            payload: "failed",
        };

        expect(actions.recievePurchaseOrderState("failed")).toEqual(expectedAction);
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
});
