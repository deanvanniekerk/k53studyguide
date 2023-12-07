import { ContentData, ContentItem, NavigationData } from '@/data';
import { contentDataSelector } from '@/state/content';
import { navigationDataSelector } from '@/state/navigation';
import { RootState } from '@/state/rootReducer';
import { navigationKeyToBreadcrumb } from '@/utils';
import { createSelector, OutputSelector, Selector } from 'reselect';
import { NavigationState } from './reducer';

const rootSelector: Selector<RootState, NavigationState> = (state: RootState): NavigationState =>
  state.study.navigation;

export const currentNavigationKeySelector: OutputSelector<
  RootState,
  string,
  (state: NavigationState) => string
> = createSelector(rootSelector, (root) => root.currentNavigationKey);

export const currentNavigationChildrenSelector: OutputSelector<
  RootState,
  string[],
  (data: NavigationData, key: string) => string[]
> = createSelector(navigationDataSelector, currentNavigationKeySelector, (data, key) => (data[key] ? data[key] : []));

export const currentNavigationParentSelector: OutputSelector<
  RootState,
  string,
  (key: string) => string
> = createSelector(currentNavigationKeySelector, (key) => {
  const breadcrumb = navigationKeyToBreadcrumb(key);

  if (breadcrumb.length <= 1) return breadcrumb[0];

  return breadcrumb[breadcrumb.length - 2];
});

export const currentContentItemsSelector: OutputSelector<
  RootState,
  ContentItem[],
  (data: ContentData, key: string) => ContentItem[]
> = createSelector(contentDataSelector, currentNavigationKeySelector, (data, key) => (data[key] ? data[key] : []));
