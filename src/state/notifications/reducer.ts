import { Notifications, NotifictionActions } from "./";

export type NotificationsState = {
    readonly notifications: Notifications;
};

export const defaultState: NotificationsState = {
    notifications: {
        welcome: {
            seen: false,
        },
    },
};

export const reducer = (
    state: NotificationsState = defaultState,
    action: NotifictionActions
): NotificationsState => {
    switch (action.type) {
        case "NOTIFICATION_RECIEVE_NOTIFICATION_STATE":
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    [action.payload.name]: action.payload.state,
                },
            };
        default:
            return state;
    }
};
