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
    0   -> 29   = 0         
    30  -> 79   = 1         30 steps
    80  -> 159  = 2         50 steps
    160 -> 269  = 3         80 steps
    275 -> 413  = 4         115 steps
    414         = 5         139 steps
*/
const levelRanges: LevelRange[] = [
    {
        level: 0,
        lower: 0,
        upper: 29,
    },
    {
        level: 1,
        lower: 30,
        upper: 79,
    },
    {
        level: 2,
        lower: 80,
        upper: 159,
    },
    {
        level: 3,
        lower: 160,
        upper: 274,
    },
    {
        level: 4,
        lower: 275,
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
    (level: number) => number
> = createSelector(dojoLevelSelector, level => {
    const range = levelRanges.find(r => r.level === level);

    if (!range) return 0;

    return range.upper + 1 - range.lower;
});
