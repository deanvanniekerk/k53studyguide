import { vi } from "vitest";
import { analytics, calculateScorePercent } from "./";

const analyticsFirebaseMock = vi.hoisted(() => ({
  logEvent: vi.fn(),
  setCurrentScreen: vi.fn(),
  setUserProperty: vi.fn(),
}));

vi.mock("@capacitor-firebase/analytics", () => ({
  FirebaseAnalytics: {
    logEvent: analyticsFirebaseMock.logEvent,
    setCurrentScreen: analyticsFirebaseMock.setCurrentScreen,
    setUserProperty: analyticsFirebaseMock.setUserProperty,
  },
}));

describe("services > analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes quiz completion into scalar GA params", () => {
    analytics.trackQuizComplete({
      question_count: 10,
      correct_count: 7,
      experience_gained: 12,
    });

    expect(analyticsFirebaseMock.logEvent).toHaveBeenCalledWith({
      name: "quiz_complete",
      params: {
        question_count: 10,
        correct_count: 7,
        score_percent: 70,
        experience_gained: 12,
      },
    });
  });

  it("maps purchase order states to funnel events", () => {
    analytics.trackPurchaseState("finished", {
      product_id: "premium_access",
      price: "R25",
      currency: "ZAR",
      value: 25,
    });

    expect(analyticsFirebaseMock.logEvent).toHaveBeenCalledWith({
      name: "purchase",
      params: {
        currency: "ZAR",
        value: 25,
        price: "R25",
        product_id: "premium_access",
        item_id: "premium_access",
        item_name: "premium_access",
        purchase_state: "finished",
      },
    });
  });

  it("sets user properties when the native plugin exposes support", () => {
    analytics.setUserProperties({
      language: "en",
      theme: "dark",
      premium_status: "premium",
    });

    expect(analyticsFirebaseMock.setUserProperty).toHaveBeenCalledWith({ key: "language", value: "en" });
    expect(analyticsFirebaseMock.setUserProperty).toHaveBeenCalledWith({ key: "theme", value: "dark" });
    expect(analyticsFirebaseMock.setUserProperty).toHaveBeenCalledWith({ key: "premium_status", value: "premium" });
  });

  it("calculates score percentages safely", () => {
    expect(calculateScorePercent(2, 3)).toBe(67);
    expect(calculateScorePercent(0, 0)).toBe(0);
  });
});
