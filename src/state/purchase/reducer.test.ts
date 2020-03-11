import { PurchaseState, reducer } from "./reducer";

describe("state > settings > reducer", () => {
    const defaultState: PurchaseState = {
        owned: false,
        canPurchase: false,
        expiryDate: null,
        status: "",
        price: "",
        title: "",
        description: "",
    };

    it("should handle PURCHASE_RECIEVE_STATUS", () => {
        const now = new Date();

        const actualState = reducer(defaultState, {
            type: "PURCHASE_RECIEVE_STATUS",
            payload: {
                owned: true,
                canPurchase: true,
                expiryDate: now,
                status: "wow",
                price: "R25",
                title: "title",
                description: "description",
            },
        });

        const expectedState = {
            ...defaultState,
            owned: true,
            canPurchase: true,
            expiryDate: now,
            status: "wow",
            price: "R25",
            title: "title",
            description: "description",
        };

        expect(actualState).toEqual(expectedState);
    });
});
