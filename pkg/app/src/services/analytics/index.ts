import { AnalyticsFirebase } from "@awesome-cordova-plugins/analytics-firebase";
import type { OrderState } from "@/state/purchase";

export type PremiumStatus = "free" | "premium";

export type AnalyticsEventName =
  | "app_open"
  | "onboarding_info_view"
  | "study_content_view"
  | "study_section_complete"
  | "quiz_start"
  | "quiz_answer"
  | "quiz_complete"
  | "mock_test_start"
  | "mock_test_complete"
  | "history_clear"
  | "rate_app_tap"
  | "view_promotion"
  | "select_promotion"
  | "begin_checkout"
  | "purchase_pending"
  | "purchase_cancel"
  | "purchase_error"
  | "purchase";

export type LegacyAnalyticsEventName =
  | "PRESENT_OFFER"
  | "NAVIGATE"
  | "RATE_APP"
  | "CLEAR_HISTORY"
  | "START_QUIZ"
  | "CONTINUE_QUIZ"
  | "QUIZ_RESULT"
  | "START_TEST"
  | "CONTINUE_TEST"
  | "TEST_RESULT";

export type AnalyticsParamValue = string | number | null | undefined;
export type AnalyticsParams = Record<string, AnalyticsParamValue>;

type PurchaseParams = {
  product_id: string;
  price?: string;
  currency?: string;
  value?: number;
  offer_surface?: string;
  cta_location?: string;
};

type UserProperties = {
  language?: string;
  theme?: string;
  premium_status?: PremiumStatus;
};

const DEFAULT_CURRENCY = "ZAR";

const normalizeParams = (params?: AnalyticsParams): Record<string, string | number> | undefined => {
  if (!params) return undefined;

  return Object.entries(params).reduce<Record<string, string | number>>((result, [key, value]) => {
    if (value === undefined || value === null) return result;
    result[key] = typeof value === "number" ? value : value;
    return result;
  }, {});
};

const scorePercent = (correctCount: number, questionCount: number) => {
  if (questionCount === 0) return 0;
  return Math.round((correctCount / questionCount) * 100);
};

const purchaseParams = (params: PurchaseParams): AnalyticsParams => ({
  currency: params.currency ?? DEFAULT_CURRENCY,
  value: params.value,
  price: params.price,
  product_id: params.product_id,
  item_id: params.product_id,
  item_name: params.product_id,
  offer_surface: params.offer_surface,
  cta_location: params.cta_location,
});

export const analytics = {
  setCurrentScreen(screenName: string) {
    AnalyticsFirebase.setCurrentScreen(screenName);
  },

  setUserProperties(properties: UserProperties) {
    const firebaseWithUserProperties = AnalyticsFirebase as unknown as {
      setUserProperty?: (name: string, value: string) => void;
    };

    Object.entries(properties).forEach(([name, value]) => {
      if (value) firebaseWithUserProperties.setUserProperty?.(name, value);
    });
  },

  logEvent(eventName: AnalyticsEventName | LegacyAnalyticsEventName, params?: AnalyticsParams) {
    AnalyticsFirebase.logEvent(eventName, normalizeParams(params));
  },

  trackAppOpen(params: { language: string; theme: string; premium_status: PremiumStatus }) {
    this.logEvent("app_open", params);
  },

  trackOnboardingInfoView(params: { screen_name: string }) {
    this.logEvent("onboarding_info_view", params);
  },

  trackStudyContentView(params: { content_key: string; content_category: string }) {
    this.logEvent("study_content_view", params);
  },

  trackStudySectionComplete(params: { content_key: string; content_category: string }) {
    this.logEvent("study_section_complete", params);
  },

  trackQuizStart(params: { quiz_mode: "new" | "continue"; question_count?: number }) {
    this.logEvent("quiz_start", params);
  },

  trackQuizAnswer(params: { question_id: string; answer_id: string; question_index: number }) {
    this.logEvent("quiz_answer", params);
  },

  trackQuizComplete(params: { question_count: number; correct_count: number; experience_gained: number }) {
    this.logEvent("quiz_complete", {
      question_count: params.question_count,
      correct_count: params.correct_count,
      score_percent: scorePercent(params.correct_count, params.question_count),
      experience_gained: params.experience_gained,
    });
  },

  trackMockTestStart(params: { quiz_mode: "new" | "continue"; question_count?: number }) {
    this.logEvent("mock_test_start", params);
  },

  trackMockTestComplete(params: {
    question_count: number;
    correct_count: number;
    passed: boolean;
    section_a_correct: number;
    section_a_total: number;
    section_a_passed: boolean;
    section_b_correct: number;
    section_b_total: number;
    section_b_passed: boolean;
    section_c_correct: number;
    section_c_total: number;
    section_c_passed: boolean;
  }) {
    this.logEvent("mock_test_complete", {
      ...params,
      passed: params.passed ? "true" : "false",
      section_a_passed: params.section_a_passed ? "true" : "false",
      section_b_passed: params.section_b_passed ? "true" : "false",
      section_c_passed: params.section_c_passed ? "true" : "false",
      score_percent: scorePercent(params.correct_count, params.question_count),
    });
  },

  trackHistoryClear(type: "seen" | "quiz" | "test") {
    this.logEvent("history_clear", { history_type: type });
  },

  trackRateAppTap(params: { cta_location: string }) {
    this.logEvent("rate_app_tap", params);
  },

  trackPromotionView(params: PurchaseParams) {
    this.logEvent("view_promotion", purchaseParams(params));
  },

  trackPromotionSelect(params: PurchaseParams) {
    this.logEvent("select_promotion", purchaseParams(params));
  },

  trackBeginCheckout(params: PurchaseParams) {
    this.logEvent("begin_checkout", purchaseParams(params));
  },

  trackPurchaseState(orderState: OrderState, params: PurchaseParams) {
    const eventByOrderState: Partial<Record<OrderState, AnalyticsEventName>> = {
      pending: "purchase_pending",
      cancelled: "purchase_cancel",
      error: "purchase_error",
      finished: "purchase",
    };
    const eventName = eventByOrderState[orderState];
    if (!eventName) return;

    this.logEvent(eventName, {
      ...purchaseParams(params),
      purchase_state: orderState,
    });
  },
};

export const calculateScorePercent = scorePercent;
