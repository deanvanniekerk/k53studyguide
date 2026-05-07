import { type NavigationState, reducer } from "./reducer";

describe("state > quiz > navigation > reducer", () => {
  const defaultState: NavigationState = {
    targetNavigationKey: "nav",
  };

  it("should handle QUIZ_NAV_RECIEVE_TARGET_NAVIGATION_KEY", () => {
    const state: NavigationState = {
      ...defaultState,
      targetNavigationKey: "oldKey",
    };

    const actualState = reducer(state, {
      type: "QUIZ_NAV_RECIEVE_TARGET_NAVIGATION_KEY",
      payload: "newKey",
    });

    const expectedState = {
      ...defaultState,
      targetNavigationKey: "newKey",
    };

    expect(actualState).toEqual(expectedState);
  });
});
