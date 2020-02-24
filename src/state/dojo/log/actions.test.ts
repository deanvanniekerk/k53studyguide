import * as actions from "./actions";

describe("state > dojo > log > actions", () => {
    it("recieveQuesionSuccesfullyAnsweredDate", () => {
        const date = new Date();
        const expectedAction = {
            type: "DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE",
            payload: {
                questionId: "99",
                date: date,
            },
        };

        expect(actions.recieveQuesionSuccesfullyAnsweredDate("99", date)).toEqual(expectedAction);
    });
});
