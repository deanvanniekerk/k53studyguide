import * as actions from "./actions";

describe("state > purchase > actions", () => {
    it("recievePurchaseStatus", () => {
        const now = new Date();
        const expectedAction = {
            type: "PURCHASE_RECIEVE_STATUS",
            payload: {
                owned: true,
                canPurchase: false,
                expiryDate: now,
                status: "wow wow wow wow",
                title: "title",
                description: "description",
                price: "R25",
            },
        };

        expect(
            actions.recievePurchaseStatus(
                true,
                false,
                now,
                "wow wow wow wow",
                "R25",
                "title",
                "description"
            )
        ).toEqual(expectedAction);
    });
});
