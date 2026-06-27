import { ROOT_NAVIGATION_KEY } from "@k53studyguide/shared/quiz";
import { type NavigationData, navigationData } from "@/data";

export { ROOT_NAVIGATION_KEY };

export type NavigationState = {
  readonly navigationData: NavigationData;
};

export const defaultState: NavigationState = {
  navigationData: navigationData,
};

export const reducer = (state: NavigationState = defaultState): NavigationState => {
  return state;
};
