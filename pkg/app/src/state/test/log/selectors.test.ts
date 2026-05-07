import type { LogState } from "./";
import * as selectors from "./selectors";

describe("state > test > log > selectors", () => {
  //Setup Data --------------------------------------------
  const defaultState: LogState = {
    quesionsSuccesfullyAnsweredDates: {
      "1": new Date().toISOString(),
    },
    testsPassed: 5,
  };
  //-----------------------------------------------------------

  it("quesionsSuccesfullyAnsweredDatesSelector", () => {
    const actual = selectors.quesionsSuccesfullyAnsweredDatesSelector.resultFunc(defaultState);

    expect(actual).toEqual(defaultState.quesionsSuccesfullyAnsweredDates);
  });

  it("testsPassedSelector", () => {
    const actual = selectors.testsPassedSelector.resultFunc(defaultState);

    expect(actual).toEqual(5);
  });
});
