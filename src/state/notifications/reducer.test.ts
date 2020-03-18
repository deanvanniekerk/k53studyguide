import { NotificationsState, reducer } from "./reducer";

describe("state > notifications > reducer", () => {
    const defaultState: NotificationsState = {
        notifications: {
            welcome: {
                seen: false,
            },
        },
    };

    it("should handle NOTIFICATION_RECIEVE_NOTIFICATION_STATE", () => {
        const actualState = reducer(defaultState, {
            type: "NOTIFICATION_RECIEVE_NOTIFICATION_STATE",
            payload: {
                name: "welcome",
                state: {
                    seen: true,
                },
            },
        });

        const expectedState = {
            ...defaultState,
            notifications: {
                ...defaultState.notifications,
                welcome: {
                    seen: true,
                },
            },
        };

        expect(actualState).toEqual(expectedState);
    });
});
