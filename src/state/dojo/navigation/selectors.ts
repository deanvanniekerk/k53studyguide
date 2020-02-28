import { createSelector, OutputSelector, Selector } from "reselect";

import { NavigationData, QuestionData } from "@/data";
import {
    navigationDataSelector,
    NavigationTreeItem,
    navigationTreeSelector,
} from "@/state/navigation";
import { questionDataSelector } from "@/state/questions";
import { RootState } from "@/state/rootReducer";
import { navigationKeyToBreadcrumb } from "@/utils";

import { QuesionsSuccesfullyAnsweredDates, quesionsSuccesfullyAnsweredDatesSelector } from "../log";
import { NavigationState } from "./reducer";
import { CorrectlyAnsweredQuestionsTotal, CorrectlyAnsweredQuestionsTotals } from "./types";

const rootSelector: Selector<RootState, NavigationState> = (state: RootState): NavigationState =>
    state.dojo.navigation;

export const targetNavigationKeySelector: OutputSelector<
    RootState,
    string,
    (state: NavigationState) => string
> = createSelector(rootSelector, root => root.targetNavigationKey);

export const targetNavigationChildrenSelector: OutputSelector<
    RootState,
    string[],
    (data: NavigationData, key: string) => string[]
> = createSelector(navigationDataSelector, targetNavigationKeySelector, (data, key) =>
    key && data[key] ? data[key] : []
);

export const targetNavigationParentSelector: OutputSelector<
    RootState,
    string,
    (key: string) => string
> = createSelector(targetNavigationKeySelector, key => {
    const breadcrumb = navigationKeyToBreadcrumb(key);

    if (breadcrumb.length <= 1) return breadcrumb[0];

    return breadcrumb[breadcrumb.length - 2];
});

export const correctlyAnsweredQuestionsTotalsSelector: OutputSelector<
    RootState,
    CorrectlyAnsweredQuestionsTotals,
    (
        questionDate: QuestionData,
        auesionsSuccesfullyAnsweredDates: QuesionsSuccesfullyAnsweredDates,
        navigationTree: NavigationTreeItem
    ) => CorrectlyAnsweredQuestionsTotals
> = createSelector(
    questionDataSelector,
    quesionsSuccesfullyAnsweredDatesSelector,
    navigationTreeSelector,
    (questionData, quesionsSuccesfullyAnsweredDates, navigationTree) => {
        const totals: CorrectlyAnsweredQuestionsTotals = {};

        const walk = (node: NavigationTreeItem): CorrectlyAnsweredQuestionsTotal => {
            const questions = questionData[node.key] || [];
            const correctlyAnswered = questions.filter(
                q => !!quesionsSuccesfullyAnsweredDates[q.id]
            );

            const total: CorrectlyAnsweredQuestionsTotal = {
                correctlyAnswered: correctlyAnswered.length,
                total: questions.length,
            };

            node.children.forEach(child => {
                const childTotal = walk(child);
                total.correctlyAnswered += childTotal.correctlyAnswered;
                total.total += childTotal.total;
            });

            totals[node.key] = total;

            return total;
        };

        walk(navigationTree);

        return totals;
    }
);
