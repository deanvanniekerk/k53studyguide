import { createSelector, type Selector } from "reselect";
import type { RootState } from "@/state/rootReducer";

type OutputSelector<State, Result, Combiner> = Selector<State, Result> & {
  resultFunc: Combiner;
};

import type { Notifications } from "./";
import type { NotificationsState } from "./reducer";

const rootSelector: Selector<RootState, NotificationsState> = (state: RootState): NotificationsState =>
  state.notifications;

export const notificationsSelector: OutputSelector<
  RootState,
  Notifications,
  (state: NotificationsState) => Notifications
> = createSelector(rootSelector, (root) => root.notifications);
