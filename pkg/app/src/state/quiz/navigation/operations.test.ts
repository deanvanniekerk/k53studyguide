import createMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { navigateUp, recieveTargetNavigationKey } from "./";

type DispatchExts = ReturnType<typeof navigateUp>;

import type { Middleware } from "redux";

const middlewares = [thunk] as unknown as Middleware[];
const mockStore = createMockStore<Record<string, unknown>, (action: DispatchExts) => void>(middlewares as never);

describe("state > quiz > navigation > operations", () => {
  it("navigateUp - 3 levels", () => {
    const store = mockStore({
      quiz: {
        navigation: {
          targetNavigationKey: "level1.level2.level3",
        },
      },
    });

    store.dispatch(navigateUp());

    const actions = store.getActions();

    expect(actions.length).toEqual(1);
    expect(actions[0]).toEqual(recieveTargetNavigationKey("level1.level2"));
  });

  it("navigateUp - top level", () => {
    const store = mockStore({
      quiz: {
        navigation: {
          targetNavigationKey: "level1",
        },
      },
    });

    store.dispatch(navigateUp());

    const actions = store.getActions();

    expect(actions.length).toEqual(1);
    expect(actions[0]).toEqual(recieveTargetNavigationKey("level1"));
  });
});
