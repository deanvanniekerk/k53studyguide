import { createSelector, OutputSelector, Selector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { LogState, QuesionsSuccesfullyAnsweredDates } from "./";

type LevelRange = {
    level: number;
    //Inclusive lower
    lower: number;
    //Inclusive uppoer
    upper: number;
};

/*
    LEVELS:
    0   -> 0    = 0         
    1   -> 39   = 1         40 steps
    40  -> 109  = 2         70 steps
    110 -> 229  = 3         120 steps
    230 -> 413  = 4         187 steps
    414         = 5         
*/
const levelRanges: LevelRange[] = [
    {
        level: 0,
        lower: 0,
        upper: 0,
    },
    {
        level: 1,
        lower: 1,
        upper: 39,
    },
    {
        level: 2,
        lower: 40,
        upper: 109,
    },
    {
        level: 3,
        lower: 110,
        upper: 229,
    },
    {
        level: 4,
        lower: 230,
        upper: 413,
    },
    {
        level: 5,
        lower: 414,
        upper: 414,
    },
];

const rootSelector: Selector<RootState, LogState> = (state: RootState): LogState => state.dojo.log;

export const quesionsSuccesfullyAnsweredDatesSelector: OutputSelector<
    RootState,
    QuesionsSuccesfullyAnsweredDates,
    (state: LogState) => QuesionsSuccesfullyAnsweredDates
> = createSelector(rootSelector, root => root.quesionsSuccesfullyAnsweredDates);

export const quesionsSuccesfullyAnsweredSelector: OutputSelector<
    RootState,
    number,
    (state: LogState) => number
> = createSelector(rootSelector, root => Object.keys(root.quesionsSuccesfullyAnsweredDates).length);

export const dojoLevelSelector: OutputSelector<
    RootState,
    number,
    (current: number) => number
> = createSelector(quesionsSuccesfullyAnsweredSelector, current => {
    return levelRanges.filter(r => current <= r.upper)[0].level;
});

export const dojoCurrentExperiencePercentSelector: OutputSelector<
    RootState,
    number,
    (current: number, level: number) => number
> = createSelector(quesionsSuccesfullyAnsweredSelector, dojoLevelSelector, (current, level) => {
    const range = levelRanges.find(r => r.level === level);

    if (!range) return 0;

    return Math.floor(((current - range.lower) / (range.upper + 1 - range.lower)) * 100);
});

export const requiredLevelUpExperiencePointsSelector: OutputSelector<
    RootState,
    number,
    (current: number, level: number) => number
> = createSelector(quesionsSuccesfullyAnsweredSelector, dojoLevelSelector, (current, level) => {
    const range = levelRanges.find(r => r.level === level);

    if (!range) return 0;

    return range.upper + 1 - current;
});
