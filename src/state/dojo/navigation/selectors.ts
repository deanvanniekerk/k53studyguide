import { createSelector, type Selector } from "reselect";
import type { NavigationData, QuestionData } from "@/data";
import { type NavigationTreeItem, navigationDataSelector, navigationTreeSelector } from "@/state/navigation";
import { questionDataSelector } from "@/state/questions";
import type { RootState } from "@/state/rootReducer";

type OutputSelector<State, Result, Combiner> = Selector<State, Result> & {
  resultFunc: Combiner;
};

import { navigationKeyToBreadcrumb } from "@/utils";
import { type QuesionsSuccesfullyAnsweredDates, quesionsSuccesfullyAnsweredDatesSelector } from "../log";
import type { NavigationState } from "./reducer";
import type { CorrectlyAnsweredQuestionsTotal, CorrectlyAnsweredQuestionsTotals } from "./types";

const rootSelector: Selector<RootState, NavigationState> = (state: RootState): NavigationState => state.dojo.navigation;

export const targetNavigationKeySelector: OutputSelector<RootState, string, (state: NavigationState) => string> =
  createSelector(rootSelector, (root) => root.targetNavigationKey);

export const targetNavigationChildrenSelector: OutputSelector<
  RootState,
  string[],
  (data: NavigationData, key: string) => string[]
> = createSelector(navigationDataSelector, targetNavigationKeySelector, (data, key) =>
  key && data[key] ? data[key] : [],
);

export const targetNavigationParentSelector: OutputSelector<RootState, string, (key: string) => string> =
  createSelector(targetNavigationKeySelector, (key) => {
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
    navigationTree: NavigationTreeItem,
  ) => CorrectlyAnsweredQuestionsTotals
> = createSelector(
  questionDataSelector,
  quesionsSuccesfullyAnsweredDatesSelector,
  navigationTreeSelector,
  (questionData, quesionsSuccesfullyAnsweredDates, navigationTree) => {
    const totals: CorrectlyAnsweredQuestionsTotals = {};

    const getLevel = (current: number, total: number): number => {
      const percent = Math.floor((current / total) * 100);
      if (percent === 100) return 5;
      else if (percent >= 75) return 4;
      else if (percent >= 50) return 3;
      else if (percent >= 25) return 2;
      else if (percent >= 1) return 1;
      return 0;
    };

    const walk = (node: NavigationTreeItem): CorrectlyAnsweredQuestionsTotal => {
      const questions = questionData[node.key] || [];
      const correctlyAnswered = questions.filter((q) => !!quesionsSuccesfullyAnsweredDates[q.id]);

      const total: CorrectlyAnsweredQuestionsTotal = {
        correctlyAnswered: correctlyAnswered.length,
        total: questions.length,
        level: getLevel(correctlyAnswered.length, questions.length),
      };

      node.children.forEach((child) => {
        const childTotal = walk(child);
        total.correctlyAnswered += childTotal.correctlyAnswered;
        total.total += childTotal.total;
        total.level = getLevel(total.correctlyAnswered, total.total);
      });

      totals[node.key] = total;

      return total;
    };

    walk(navigationTree);

    return totals;
  },
);
