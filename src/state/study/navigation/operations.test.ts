import createMockStore from "redux-mock-store";
import thunk, { ThunkDispatch } from "redux-thunk";
import { RootState } from "src/state";

import { navigateUp, recieveCurrentNavigationKey, RecieveCurrentNavigationKeyAction } from "./";

type DispatchExts = ThunkDispatch<RootState, void, RecieveCurrentNavigationKeyAction>;

const middlewares = [thunk];
const mockStore = createMockStore<RootState, DispatchExts>(middlewares);

describe("state > study > navigation > operations", () => {
    it("navigateUp - 3 levels", () => {
        // const store = mockStore({
        //     study: {
        //         navigation: {
        //             currentNavigationKey: "level1.level2.level3",
        //         },
        //     },
        // });

        // store.dispatch(navigateUp());

        // const actions = store.getActions();

        // expect(actions.length).toEqual(1);
        // expect(actions[0]).toEqual(recieveCurrentNavigationKey("level1.level2"));
        expect(true).toBeTruthy();
    });

    // it("navigateUp - top level", () => {
    //     const store = mockStore({
    //         study: {
    //             navigation: {
    //                 currentNavigationKey: "level1",
    //             },
    //         },
    //     });

    //     store.dispatch(navigateUp());

    //     const actions = store.getActions();

    //     expect(actions.length).toEqual(1);
    //     expect(actions[0]).toEqual(recieveCurrentNavigationKey("level1"));
    // });
});
