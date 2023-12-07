export type NotificationName = 'studyInfo' | 'dojoInfo' | 'arenaInfo';

export type NotificationState = {
  seen: boolean;
};

export type Notifications = {
  [key in NotificationName]: NotificationState;
};
