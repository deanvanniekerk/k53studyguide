import * as actions from "./actions";

describe("state > arena > log > actions", () => {
    it("recieveQuesionSuccesfullyAnsweredDate", () => {
        const date = new Date();
        const expectedAction = {
            type: "ARENA_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE",
            payload: {
                questionId: "99",
                date: date.toISOString(),
            },
        };

        expect(actions.recieveQuesionSuccesfullyAnsweredDate("99", date.toISOString())).toEqual(
            expectedAction
        );
    });

    it("incrementPassedTestsAction", () => {
        const expectedAction = {
            type: "ARENA_LOG_INCREMENT_PASSED_TESTS",
        };

        expect(actions.incrementPassedTests()).toEqual(expectedAction);
    });

    it("clearPassedTests", () => {
        const expectedAction = {
            type: "ARENA_LOG_CLEAR_PASSED_TESTS",
        };

        expect(actions.clearPassedTests()).toEqual(expectedAction);
    });

    it("clearQuesionSuccesfullyAnsweredDates", () => {
        const expectedAction = {
            type: "ARENA_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES",
        };

        expect(actions.clearQuesionSuccesfullyAnsweredDates()).toEqual(expectedAction);
    });
});
