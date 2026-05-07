import type { LogState } from "./";
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

  it("quizLevelSelector > level 0", () => {
    const actual = selectors.quizLevelSelector.resultFunc(0);

    expect(actual).toEqual(0);
  });

  it("quizLevelSelector > level 1", () => {
    const actual = selectors.quizLevelSelector.resultFunc(30);

    expect(actual).toEqual(1);
  });

  it("quizLevelSelector > level 2", () => {
    const actual = selectors.quizLevelSelector.resultFunc(109);

    expect(actual).toEqual(2);
  });

  it("quizLevelSelector > level 3", () => {
    const actual = selectors.quizLevelSelector.resultFunc(200);

    expect(actual).toEqual(3);
  });

  it("quizLevelSelector > level 4", () => {
    const actual = selectors.quizLevelSelector.resultFunc(413);

    expect(actual).toEqual(4);
  });

  it("quizLevelSelector > level 5", () => {
    const actual = selectors.quizLevelSelector.resultFunc(414);

    expect(actual).toEqual(5);
  });

  it("quizCurrentExperiencePercentSelector > level 0 > 0%", () => {
    const actual = selectors.quizCurrentExperiencePercentSelector.resultFunc(0, 0);

    expect(actual).toEqual(0);
  });

  it("quizCurrentExperiencePercentSelector > level 1 > 48%", () => {
    const actual = selectors.quizCurrentExperiencePercentSelector.resultFunc(20, 1);

    expect(actual).toEqual(48);
  });

  it("quizCurrentExperiencePercentSelector > level 4 > 50%", () => {
    const actual = selectors.quizCurrentExperiencePercentSelector.resultFunc(413, 4);

    expect(actual).toEqual(99);
  });

  it("quizCurrentExperiencePercentSelector > level 5 > 0%", () => {
    const actual = selectors.quizCurrentExperiencePercentSelector.resultFunc(414, 5);

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
