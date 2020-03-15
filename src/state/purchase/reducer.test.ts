import { PurchaseState, reducer } from "./reducer";

describe("state > settings > reducer", () => {
    const defaultState: PurchaseState = {
        owned: false,
        purchaseDate: null,
        canPurchase: false,
        status: "",
        price: "",
        title: "",
        description: "",
    };

    it("should handle PURCHASE_RECIEVE_STATUS", () => {
        const actualState = reducer(defaultState, {
            type: "PURCHASE_RECIEVE_STATUS",
            payload: {
                canPurchase: true,
                status: "wow",
            },
        });

        const expectedState = {
            ...defaultState,
            canPurchase: true,
            status: "wow",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle PURCHASE_RECIEVE_PRODUCT", () => {
        const actualState = reducer(defaultState, {
            type: "PURCHASE_RECIEVE_PRODUCT",
            payload: {
                price: "R25",
                title: "title",
                description: "description",
            },
        });

        const expectedState = {
            ...defaultState,
            price: "R25",
            title: "title",
            description: "description",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle PURCHASE_RECIEVE_OWNED", () => {
        const now = new Date();

        const actualState = reducer(defaultState, {
            type: "PURCHASE_RECIEVE_OWNED",
            payload: {
                owned: true,
                purchaseDate: now,
            },
        });

        const expectedState = {
            ...defaultState,
            owned: true,
            purchaseDate: now,
        };

        expect(actualState).toEqual(expectedState);
    });
});
