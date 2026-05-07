export type NotificationName = "studyInfo" | "quizInfo" | "testInfo";

export type NotificationState = {
  seen: boolean;
};

export type Notifications = {
  [key in NotificationName]: NotificationState;
};
