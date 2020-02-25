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

    it("dojoLevelSelector > level 0", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(10);

        expect(actual).toEqual(0);
    });

    it("dojoLevelSelector > level 1", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(30);

        expect(actual).toEqual(1);
    });

    it("dojoLevelSelector > level 2", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(159);

        expect(actual).toEqual(2);
    });

    it("dojoLevelSelector > level 3", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(200);

        expect(actual).toEqual(3);
    });

    it("dojoLevelSelector > level 4", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(413);

        expect(actual).toEqual(4);
    });

    it("dojoLevelSelector > level 5", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(414);

        expect(actual).toEqual(5);
    });

    it("dojoCurrentExperiencePercentSelector > level 0 > 50%", () => {
        const actual = selectors.dojoCurrentExperiencePercentSelector.resultFunc(15, 0);

        expect(actual).toEqual(50);
    });

    it("dojoCurrentExperiencePercentSelector > level 1 > 50%", () => {
        const actual = selectors.dojoCurrentExperiencePercentSelector.resultFunc(55, 1);

        expect(actual).toEqual(50);
    });

    it("dojoCurrentExperiencePercentSelector > level 4 > 50%", () => {
        const actual = selectors.dojoCurrentExperiencePercentSelector.resultFunc(413, 4);

        expect(actual).toEqual(99);
    });

    it("dojoCurrentExperiencePercentSelector > level 5 > 0%", () => {
        const actual = selectors.dojoCurrentExperiencePercentSelector.resultFunc(414, 5);

        expect(actual).toEqual(0);
    });

    it("requiredLevelUpExperiencePointsSelector > level 0 > 30", () => {
        const actual = selectors.requiredLevelUpExperiencePointsSelector.resultFunc(0);

        expect(actual).toEqual(30);
    });

    it("requiredLevelUpExperiencePointsSelector > level 2 > 80", () => {
        const actual = selectors.requiredLevelUpExperiencePointsSelector.resultFunc(2);

        expect(actual).toEqual(80);
    });
});
