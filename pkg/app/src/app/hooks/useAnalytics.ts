import { useCallback } from "react";
import {
  type AnalyticsEventName,
  type AnalyticsParams,
  analytics,
  type LegacyAnalyticsEventName,
} from "@/services/analytics";

export const useAnalytics = (screen?: string) => {
  const setCurrentScreen = useCallback((screen: string) => {
    analytics.setCurrentScreen(screen);
  }, []);

  const logEvent = useCallback(
    (event: AnalyticsEventName | LegacyAnalyticsEventName, eventParams?: AnalyticsParams) => {
      analytics.logEvent(event, eventParams);
    },
    [],
  );

  void screen;

  return {
    setCurrentScreen,
    logEvent,
    analytics,
  };
};
