import { createSelector, OutputSelector, Selector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { Notifications } from "./";
import { NotificationsState } from "./reducer";

const rootSelector: Selector<RootState, NotificationsState> = (
    state: RootState
): NotificationsState => state.notifications;

export const notificationsSelector: OutputSelector<
    RootState,
    Notifications,
    (state: NotificationsState) => Notifications
> = createSelector(rootSelector, root => root.notifications);
