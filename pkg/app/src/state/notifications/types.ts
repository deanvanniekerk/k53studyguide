export type NotificationName = "studyInfo" | "quizInfo" | "testInfo" | "webProgress";

export type NotificationState = {
  seen: boolean;
};

export type Notifications = {
  [key in NotificationName]: NotificationState;
};
