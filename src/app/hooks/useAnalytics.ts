import { AnalyticsFirebase } from '@awesome-cordova-plugins/analytics-firebase';
import { useCallback, useEffect } from 'react';

// ADD_PAYMENT_INFO;
// ADD_TO_CART;
// ADD_TO_WISHLIST;
// APP_OPEN;
// BEGIN_CHECKOUT;
// CAMPAIGN_DETAILS;
// CHECKOUT_PROGRESS;
// EARN_VIRTUAL_CURRENCY;
// ECOMMERCE_PURCHASE;
// GENERATE_LEAD;
// JOIN_GROUP;
// LEVEL_END;
// LEVEL_START;
// LEVEL_UP;
// LOGIN;
// POST_SCORE;
// PRESENT_OFFER;
// PURCHASE_REFUND;
// REMOVE_FROM_CART;
// SEARCH;
// SELECT_CONTENT;
// SET_CHECKOUT_OPTION;
// SHARE;
// SIGN_UP;
// SPEND_VIRTUAL_CURRENCY;
// TUTORIAL_BEGIN;
// TUTORIAL_COMPLETE;
// UNLOCK_ACHIEVEMENT;
// VIEW_ITEM;
// VIEW_ITEM_LIST;
// VIEW_SEARCH_RESULTS;

type Event =
  | 'PRESENT_OFFER'
  | 'NAVIGATE'
  | 'RATE_APP'
  | 'CLEAR_HISTORY'
  | 'START_QUIZ'
  | 'CONTINUE_QUIZ'
  | 'QUIZ_RESULT'
  | 'START_TEST'
  | 'CONTINUE_TEST'
  | 'TEST_RESULT';

export const useAnalytics = (screen?: string) => {
  const setCurrentScreen = useCallback((screen: string) => {
    AnalyticsFirebase.setCurrentScreen(screen);
  }, []);

  const logEvent = useCallback((event: Event, eventParams?: Record<string, unknown>) => {
    AnalyticsFirebase.logEvent(event, eventParams);
  }, []);

  useEffect(() => {
    if (screen) setCurrentScreen(screen);
  });

  return {
    setCurrentScreen,
    logEvent,
  };
};
