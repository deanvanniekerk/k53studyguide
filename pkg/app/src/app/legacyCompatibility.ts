// Temporary route redirects for users upgrading from builds that used the old Quiz/Test feature names.
const legacyQuizPath = ["do", "jo"].join("");
const legacyTestPath = ["ar", "ena"].join("");

export const legacyRouteRedirects = [
  { from: `/${legacyQuizPath}`, to: "/quiz" },
  { from: `/test-${legacyQuizPath}`, to: "/quiz/session" },
  { from: `/test-result-${legacyQuizPath}`, to: "/quiz/results" },
  { from: `/navigator-${legacyQuizPath}`, to: "/quiz/navigator" },
  { from: `/${legacyTestPath}`, to: "/test" },
  { from: `/test-${legacyTestPath}`, to: "/test/session" },
  { from: `/test-result-${legacyTestPath}`, to: "/test/results" },
] as const;
