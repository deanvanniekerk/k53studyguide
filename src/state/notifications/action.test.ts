import * as actions from "./actions";

describe("state > notification > actions", () => {
    it("recieveRecieveNotificationState", () => {
        const expectedAction = {
            type: "NOTIFICATION_RECIEVE_NOTIFICATION_STATE",
            payload: {
                name: "welcome",
                state: {
                    seen: true,
                },
            },
        };

        expect(
            actions.recieveRecieveNotificationState("welcome", {
                seen: true,
            })
        ).toEqual(expectedAction);
    });
});
