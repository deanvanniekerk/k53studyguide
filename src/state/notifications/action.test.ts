import * as actions from "./actions";

describe("state > notification > actions", () => {
    it("recieveRecieveNotificationState", () => {
        const expectedAction = {
            type: "NOTIFICATION_RECIEVE_NOTIFICATION_STATE",
            payload: {
                name: "studyInfo",
                state: {
                    seen: true,
                },
            },
        };

        expect(
            actions.recieveRecieveNotificationState("studyInfo", {
                seen: true,
            })
        ).toEqual(expectedAction);
    });
});
