import * as actions from "./actions";

describe("state > quiz > navigation > actions", () => {
  it("recieveTargetNavigationKey", () => {
    const expectedAction = {
      type: "QUIZ_NAV_RECIEVE_TARGET_NAVIGATION_KEY",
      payload: "99",
    };

    expect(actions.recieveTargetNavigationKey("99")).toEqual(expectedAction);
  });
});
