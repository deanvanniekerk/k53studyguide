import { LogState } from "./";
import * as selectors from "./selectors";

describe("state > study > log > selectors", () => {
    //Setup Data --------------------------------------------
    const defaultState: LogState = {
        quesionsSuccesfullyAnsweredDates: {
            "1": new Date().toISOString(),
        },
    };
    //-----------------------------------------------------------

    it("quesionsSuccesfullyAnsweredDatesSelector", () => {
        const actual = selectors.quesionsSuccesfullyAnsweredDatesSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.quesionsSuccesfullyAnsweredDates);
    });

    it("dojoLevelSelector > level 0", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(0);

        expect(actual).toEqual(0);
    });

    it("dojoLevelSelector > level 1", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(30);

        expect(actual).toEqual(1);
    });

    it("dojoLevelSelector > level 2", () => {
        const actual = selectors.dojoLevelSelector.resultFunc(109);

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

    it("dojoCurrentExperiencePercentSelector > level 0 > 0%", () => {
        const actual = selectors.dojoCurrentExperiencePercentSelector.resultFunc(0, 0);

        expect(actual).toEqual(0);
    });

    it("dojoCurrentExperiencePercentSelector > level 1 > 48%", () => {
        const actual = selectors.dojoCurrentExperiencePercentSelector.resultFunc(20, 1);

        expect(actual).toEqual(48);
    });

    it("dojoCurrentExperiencePercentSelector > level 4 > 50%", () => {
        const actual = selectors.dojoCurrentExperiencePercentSelector.resultFunc(413, 4);

        expect(actual).toEqual(99);
    });

    it("dojoCurrentExperiencePercentSelector > level 5 > 0%", () => {
        const actual = selectors.dojoCurrentExperiencePercentSelector.resultFunc(414, 5);

        expect(actual).toEqual(0);
    });

    it("requiredLevelUpExperiencePointsSelector > level 0 > 1", () => {
        const actual = selectors.requiredLevelUpExperiencePointsSelector.resultFunc(0, 0);

        expect(actual).toEqual(1);
    });

    it("requiredLevelUpExperiencePointsSelector > level 2 > 80", () => {
        const actual = selectors.requiredLevelUpExperiencePointsSelector.resultFunc(100, 2);

        expect(actual).toEqual(10);
    });
});
