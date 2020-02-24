import { LogState } from "./";
import * as selectors from "./selectors";

describe("state > study > log > selectors", () => {
    //Setup Data --------------------------------------------
    const defaultState: LogState = {
        quesionsSuccesfullyAnsweredDates: {
            "1": new Date(),
        },
    };
    //-----------------------------------------------------------

    it("seenContentKeysSelector", () => {
        const actual = selectors.quesionsSuccesfullyAnsweredDatesSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.quesionsSuccesfullyAnsweredDates);
    });
});
