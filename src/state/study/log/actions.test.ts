import * as actions from "./actions";

describe("state > study > log > actions", () => {
    it("recieveSeenContentKey", () => {
        const expectedAction = {
            type: "STUDY_LOG_RECIEVE_SEEN_CONTENT_KEY",
            payload: "99",
        };

        expect(actions.recieveSeenContentKey("99")).toEqual(expectedAction);
    });

    it("recieveLastSeenParentContentKey", () => {
        const expectedAction = {
            type: "STUDY_LOG_RECIEVE_LAST_SEEN_PARENT_CONTENT_KEY",
            payload: "88",
        };

        expect(actions.recieveLastSeenParentContentKey("88")).toEqual(expectedAction);
    });

    it("clearSeenContent", () => {
        const expectedAction = {
            type: "STUDY_LOG_CLEAR_SEEN_CONTENT",
        };

        expect(actions.clearSeenContent()).toEqual(expectedAction);
    });
});
