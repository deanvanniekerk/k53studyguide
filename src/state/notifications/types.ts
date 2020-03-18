export type NotificationName = "welcome";

export type NotificationState = {
    seen: boolean;
};

export type Notifications = {
    [key in NotificationName]: NotificationState;
};
