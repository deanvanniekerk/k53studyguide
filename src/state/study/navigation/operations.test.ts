import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { navigateUp, recieveCurrentNavigationKey } from "./";

const middlewares = [thunk];
const mockStore = createMockStore(middlewares);

describe("state > study > navigation > operations", () => {
    it("navigateUp - 3 levels", () => {
        const store = mockStore({
            study: {
                navigation: {
                    currentNavigationKey: "level1.level2.level3",
                },
            },
        });

        store.dispatch(navigateUp());

        const actions = store.getActions();

        expect(actions.length).toEqual(1);
        expect(actions[0]).toEqual(recieveCurrentNavigationKey("level1.level2"));
    });

    it("navigateUp - top level", () => {
        const store = mockStore({
            study: {
                navigation: {
                    currentNavigationKey: "level1",
                },
            },
        });

        store.dispatch(navigateUp());

        const actions = store.getActions();

        expect(actions.length).toEqual(1);
        expect(actions[0]).toEqual(recieveCurrentNavigationKey("level1"));
    });
});
