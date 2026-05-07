import type { PersistedState } from "redux-persist/es/types";
import type { NotificationsState } from "./notifications";

// Temporary compatibility keys for users upgrading from builds that used the old Quiz/Test feature names.
const legacyQuizName = ["do", "jo"].join("");
const legacyTestName = ["ar", "ena"].join("");

export const legacyPersistKeys = {
  quizSession: `persist:${legacyQuizName}-test`,
  quizLog: `persist:${legacyQuizName}-log`,
  quizNavigation: `persist:${legacyQuizName}-navigation`,
  testSession: `persist:${legacyTestName}-test`,
  testLog: `persist:${legacyTestName}-log`,
} as const;

const legacyQuizInfoKey = `${legacyQuizName}Info`;
const legacyTestInfoKey = `${legacyTestName}Info`;

type LegacyNotificationsState = PersistedState &
  NotificationsState & {
    readonly notifications: NotificationsState["notifications"] & Record<string, { seen: boolean } | undefined>;
  };

export const migrateLegacyNotifications = (state: PersistedState): Promise<PersistedState> => {
  const legacyState = state as LegacyNotificationsState | undefined;

  return Promise.resolve({
    _persist: legacyState?._persist ?? { version: -1, rehydrated: false },
    notifications: {
      studyInfo: legacyState?.notifications?.studyInfo ?? { seen: false },
      quizInfo: legacyState?.notifications?.quizInfo ??
        legacyState?.notifications?.[legacyQuizInfoKey] ?? { seen: false },
      testInfo: legacyState?.notifications?.testInfo ??
        legacyState?.notifications?.[legacyTestInfoKey] ?? { seen: false },
    },
  } as PersistedState);
};
