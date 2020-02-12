import { LogState } from "@/state/study/log";
import * as selectors from "@/state/study/log/selectors";

describe("state > study > log > selectors", () => {
    const defaultState: LogState = {
        seenContent: {},
    };

    it("contentDataSelector", () => {
        const actual = selectors.seenContentSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.seenContent);
    });
});
