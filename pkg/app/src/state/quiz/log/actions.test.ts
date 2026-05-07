import * as actions from "./actions";

describe("state > quiz > log > actions", () => {
  it("recieveQuesionSuccesfullyAnsweredDate", () => {
    const date = new Date();
    const expectedAction = {
      type: "QUIZ_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE",
      payload: {
        questionId: "99",
        date: date.toISOString(),
      },
    };

    expect(actions.recieveQuesionSuccesfullyAnsweredDate("99", date.toISOString())).toEqual(expectedAction);
  });

  it("clearQuesionSuccesfullyAnsweredDates", () => {
    const expectedAction = {
      type: "QUIZ_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES",
    };

    expect(actions.clearQuesionSuccesfullyAnsweredDates()).toEqual(expectedAction);
  });
});
