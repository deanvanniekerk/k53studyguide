import { IonIcon } from "@ionic/react";
import {
  arrowBackOutline,
  caretForward,
  checkmarkCircleOutline,
  chevronForwardOutline,
  close,
  flash,
  flashOffOutline,
  moonOutline,
  refreshOutline,
  sunnyOutline,
  trophy,
} from "ionicons/icons";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QuizLevelCard, QuizNavigatorItem, QuizQuestionCard } from "@k53studyguide/shared/react";
import {
  ROOT_NAVIGATION_KEY,
  buildQuizQuestionAnswers,
  completeQuizSession,
  navigateUp,
  navigationKeyToBreadcrumb,
  type QuestionAnswer,
  type SuccessfullyAnsweredDates,
} from "@k53studyguide/shared/quiz";
import { navigationData, questionData, type QuestionOption, translations } from "@k53studyguide/shared/data";
import phoneFrameUrl from "../../assets/generated/quiz-phone-frame.png";

type PreviewTab = "study" | "quiz" | "test" | "profile";
type QuizPreviewMode = "home" | "navigator" | "session" | "results";

type QuizPreviewState = {
  mode: QuizPreviewMode;
  currentQuestionIndex: number;
  navigatorNavigationKey: string;
  targetNavigationKey: string;
  maxQuestions: number;
  questionAnswers: QuestionAnswer[];
  successfullyAnsweredDates: SuccessfullyAnsweredDates;
  experienceGained: number;
  completedAt: string | null;
};

type LevelRange = {
  level: number;
  lower: number;
  upper: number;
};

const QUESTION_IMAGE_BASE_URL = "/quiz-assets/images";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en&referrer=utm_source%3Dwebsite%26utm_medium%3Dquiz_demo_locked_cta%26utm_campaign%3Dorganic_web";
const APP_STORE_URL = "https://apps.apple.com/us/app/k53-study-guide/id6784718443?ct=organic_web_quiz_demo_locked_cta";
type StorePlatform = "android" | "ios";
const levelRanges: LevelRange[] = [
  { level: 0, lower: 0, upper: 0 },
  { level: 1, lower: 1, upper: 39 },
  { level: 2, lower: 40, upper: 109 },
  { level: 3, lower: 110, upper: 229 },
  { level: 4, lower: 230, upper: 413 },
  { level: 5, lower: 414, upper: 414 },
];

const defaultQuizPreviewState: QuizPreviewState = {
  mode: "home",
  currentQuestionIndex: 0,
  navigatorNavigationKey: ROOT_NAVIGATION_KEY,
  targetNavigationKey: ROOT_NAVIGATION_KEY,
  maxQuestions: 10,
  questionAnswers: [],
  successfullyAnsweredDates: {},
  experienceGained: 0,
  completedAt: null,
};

const trackAnalyticsEvent = (eventName: string, params: Record<string, string | number | boolean> = {}) => {
  const analyticsWindow = window as Window & {
    gtag?: (...args: unknown[]) => void;
    posthog?: { capture?: (event: string, properties?: Record<string, unknown>) => void };
  };

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", eventName, params);
  }
  if (typeof analyticsWindow.posthog?.capture === "function") {
    analyticsWindow.posthog.capture(eventName, params);
  }
};

const getTranslation = (key: string): string => translations[key]?.en ?? key;

const prefersDarkScheme = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

const previewTabs: { key: PreviewTab; label: string }[] = [
  { key: "study", label: "Study" },
  { key: "quiz", label: "Quiz" },
  { key: "test", label: "Test" },
  { key: "profile", label: "Profile" },
];

const getNavigationLabel = (key: string) => (key === ROOT_NAVIGATION_KEY ? "All Content" : getTranslation(key));

const getNavigationBreadcrumb = (key: string, showLast = true) => {
  const keys = navigationKeyToBreadcrumb(key);
  const visibleKeys = showLast ? keys : keys.slice(0, -1);
  return visibleKeys.map(getNavigationLabel).join(" / ");
};

const getQuestionPoolCount = (navigationKey: string) =>
  Object.entries(questionData).reduce((total, [questionNavigationKey, questions]) => {
    if (!questionNavigationKey.startsWith(navigationKey)) return total;
    return total + questions.length;
  }, 0);

const getLevelProgress = (masteredQuestionCount: number) => {
  const level = levelRanges.find((range) => masteredQuestionCount <= range.upper)?.level ?? 5;
  const range = levelRanges.find((item) => item.level === level) ?? levelRanges[0];
  const progressPercent =
    level >= 5 ? 100 : Math.floor(((masteredQuestionCount - range.lower) / (range.upper + 1 - range.lower)) * 100);
  const requiredLevelUpPoints = level >= 5 ? 0 : range.upper + 1 - masteredQuestionCount;

  return {
    level,
    progressPercent: Math.max(0, progressPercent),
    requiredLevelUpPoints,
  };
};

const trackStoreCta = (ctaLocation: string, storePlatform: StorePlatform = "android") => {
  const params = {
    cta_location: ctaLocation,
    store_platform: storePlatform,
  };
  trackAnalyticsEvent("select_store_cta", params);
  trackAnalyticsEvent(storePlatform === "ios" ? "app_store_referral_click" : "play_store_referral_click", params);
};

export const QuizDemoDialog: React.FC = () => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const screenScrollRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PreviewTab>("quiz");
  const [state, setState] = useState<QuizPreviewState>(defaultQuizPreviewState);
  const [notice, setNotice] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => (prefersDarkScheme() ? "dark" : "light"));
  const hasManualThemeRef = useRef(false);
  const isDarkTheme = theme === "dark";

  const currentQuestionAnswer = state.questionAnswers[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.questionAnswers.length - 1;
  const answeredCount = state.questionAnswers.filter((questionAnswer) => questionAnswer.answer).length;
  const totalCorrectAnswers = state.questionAnswers.filter(
    (questionAnswer) => questionAnswer.answer === questionAnswer.question.answer,
  ).length;
  const masteredQuestionCount = Object.keys(state.successfullyAnsweredDates).length;
  const { level, progressPercent, requiredLevelUpPoints } = getLevelProgress(masteredQuestionCount);
  const hasQuizInProgress = state.questionAnswers.length > 0 && !state.completedAt;
  const selectedSectionLabel = getNavigationLabel(state.targetNavigationKey);
  const selectedSectionBreadcrumb = useMemo(
    () => getNavigationBreadcrumb(state.targetNavigationKey),
    [state.targetNavigationKey],
  );
  const selectedSectionParentBreadcrumb = useMemo(
    () => getNavigationBreadcrumb(state.targetNavigationKey, false),
    [state.targetNavigationKey],
  );
  const navigatorChildren = navigationData[state.navigatorNavigationKey] ?? [];
  const navigatorBreadcrumb = useMemo(
    () => getNavigationBreadcrumb(state.navigatorNavigationKey),
    [state.navigatorNavigationKey],
  );
  const activeTabLabel = previewTabs.find((tab) => tab.key === activeTab)?.label ?? "Quiz";
  const screenTitle =
    activeTab === "quiz" && state.mode === "navigator"
      ? "Select Section"
      : activeTab === "quiz"
        ? "Quiz"
        : activeTabLabel;
  const screenSubtitle =
    activeTab === "quiz" && state.mode === "home" ? "Practise by completing quizzes, gain experience and level up" : "";
  const canGoBack = activeTab === "quiz" && state.mode !== "home";

  const scrollPreviewTop = useCallback(() => {
    screenScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openDialog = useCallback((location = "unknown") => {
    setIsOpen(true);
    setActiveTab("quiz");
    trackAnalyticsEvent("quiz_demo_open", { cta_location: location });
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const triggers = document.querySelectorAll<HTMLElement>("[data-quiz-demo-open]");

    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      const target = event.currentTarget as HTMLElement;
      openDialog(target.dataset.analyticsLocation ?? "unknown");
    };

    triggers.forEach((trigger) => trigger.addEventListener("click", onClick));

    return () => {
      triggers.forEach((trigger) => trigger.removeEventListener("click", onClick));
    };
  }, [openDialog]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => dialogRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeDialog, isOpen]);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  // Follow the OS colour scheme until the user manually picks a theme.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!hasManualThemeRef.current) setTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  // Apply the app's dark palette at the document root (same as the real app's
  // Startup.tsx). It must live on :root so the app's composite CSS variables
  // (e.g. --app-card-border: 1px solid var(--app-card-border-color)) resolve
  // against the dark colour values — scoping it to a sub-element leaves those
  // composites frozen with their light values. Only active while the demo is open.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("ion-palette-dark", isOpen && isDarkTheme);
    return () => root.classList.remove("ion-palette-dark");
  }, [isOpen, isDarkTheme]);

  const toggleTheme = () => {
    hasManualThemeRef.current = true;
    setTheme((previous) => {
      const next = previous === "dark" ? "light" : "dark";
      trackAnalyticsEvent("quiz_demo_theme_toggle", { theme: next });
      return next;
    });
  };

  const showNotice = (message: string) => {
    setNotice(message);
  };

  const selectTab = (tab: PreviewTab) => {
    setActiveTab(tab);
    trackAnalyticsEvent("quiz_demo_tab_select", { tab });
    if (tab !== "quiz") {
      trackAnalyticsEvent("quiz_demo_locked_tab", { tab });
      scrollPreviewTop();
    }
  };

  const openNavigator = () => {
    if (hasQuizInProgress) return;
    setState({
      ...state,
      mode: "navigator",
      navigatorNavigationKey: state.targetNavigationKey,
    });
    scrollPreviewTop();
  };

  const selectNavigatorChild = (key: string) => {
    setState({
      ...state,
      navigatorNavigationKey: key,
    });
    trackAnalyticsEvent("quiz_demo_section_navigate", { quiz_section: key });
    scrollPreviewTop();
  };

  const useNavigatorSection = () => {
    setState({
      ...state,
      mode: "home",
      targetNavigationKey: state.navigatorNavigationKey,
    });
    trackAnalyticsEvent("quiz_demo_section_select", { quiz_section: state.navigatorNavigationKey });
    scrollPreviewTop();
  };

  const goBackInPreview = () => {
    if (state.mode === "navigator") {
      if (state.navigatorNavigationKey === ROOT_NAVIGATION_KEY) {
        setState({ ...state, mode: "home" });
        return;
      }

      setState({
        ...state,
        navigatorNavigationKey: navigateUp(state.navigatorNavigationKey) || ROOT_NAVIGATION_KEY,
      });
      scrollPreviewTop();
      return;
    }

    if (state.mode === "session") {
      setState({ ...state, mode: "home" });
      scrollPreviewTop();
      return;
    }

    if (state.mode === "results") {
      setState({
        ...state,
        mode: "home",
        currentQuestionIndex: 0,
        questionAnswers: [],
        experienceGained: 0,
        completedAt: null,
      });
      scrollPreviewTop();
    }
  };

  const startQuiz = (forceNew = false) => {
    if (!forceNew && hasQuizInProgress) {
      setState({
        ...state,
        mode: "session",
        completedAt: null,
      });
      trackAnalyticsEvent("quiz_demo_continue", { question_count: state.questionAnswers.length });
      scrollPreviewTop();
      return;
    }

    const questionAnswers = buildQuizQuestionAnswers({
      questionData,
      targetNavigationKey: state.targetNavigationKey,
      maxQuestions: state.maxQuestions,
      successfullyAnsweredDates: state.successfullyAnsweredDates,
    });

    if (questionAnswers.length === 0) {
      showNotice("No questions available for this section yet.");
      return;
    }

    setState({
      ...state,
      mode: "session",
      currentQuestionIndex: 0,
      questionAnswers,
      experienceGained: 0,
      completedAt: null,
    });
    trackAnalyticsEvent("quiz_demo_start", {
      question_count: questionAnswers.length,
      quiz_section: state.targetNavigationKey,
    });
    scrollPreviewTop();
  };

  const resetQuiz = () => {
    setState({
      ...defaultQuizPreviewState,
      successfullyAnsweredDates: state.successfullyAnsweredDates,
    });
    setNotice("Quiz reset. Pick a section and start again.");
    scrollPreviewTop();
  };

  const updateAnswer = (questionId: string, option: QuestionOption) => {
    setState({
      ...state,
      questionAnswers: state.questionAnswers.map((questionAnswer) =>
        questionAnswer.question.id === questionId ? { ...questionAnswer, answer: option.id } : questionAnswer,
      ),
    });
    trackAnalyticsEvent("quiz_demo_answer", {
      question_id: questionId,
      answer_id: option.id,
      question_index: state.currentQuestionIndex + 1,
    });
  };

  const goToNextQuestion = () => {
    const nextUnansweredIndex = state.questionAnswers.findIndex(
      (questionAnswer, index) => index > state.currentQuestionIndex && !questionAnswer.answer,
    );
    const nextIndex = nextUnansweredIndex >= 0 ? nextUnansweredIndex : state.currentQuestionIndex + 1;

    setState({
      ...state,
      currentQuestionIndex: Math.min(nextIndex, state.questionAnswers.length - 1),
    });
    scrollPreviewTop();
  };

  const submitQuiz = () => {
    if (!currentQuestionAnswer?.answer) {
      setNotice("Answer this question before continuing.");
      return;
    }

    if (!isLastQuestion) {
      goToNextQuestion();
      return;
    }

    if (state.questionAnswers.some((questionAnswer) => !questionAnswer.answer)) {
      setNotice("Please answer all questions before submitting.");
      return;
    }

    const completion = completeQuizSession({
      questionAnswers: state.questionAnswers,
      successfullyAnsweredDates: state.successfullyAnsweredDates,
    });

    setState({
      ...state,
      mode: "results",
      completedAt: completion.completedAt,
      experienceGained: completion.experienceGained,
      successfullyAnsweredDates: completion.successfullyAnsweredDates,
    });
    trackAnalyticsEvent("quiz_demo_complete", {
      question_count: state.questionAnswers.length,
      correct_count: totalCorrectAnswers,
      experience_gained: completion.experienceGained,
    });
    scrollPreviewTop();
  };

  return (
    <div
      className={isOpen ? "quiz-demo-modal open" : "quiz-demo-modal"}
      aria-hidden={!isOpen}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div
        ref={dialogRef}
        className="quiz-demo-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-demo-title"
        tabIndex={-1}
      >
        <div className="quiz-demo-dialog-top">
          <div className="quiz-demo-dialog-heading">
            <div className="quiz-demo-eyebrow">Download the app for the full experience</div>
            <h2 id="quiz-demo-title">Give the quiz a try!</h2>
          </div>
          <div className="quiz-demo-dialog-actions">
            <button
              className="quiz-demo-header-action quiz-demo-theme-toggle"
              type="button"
              aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDarkTheme}
              onClick={toggleTheme}
            >
              <IonIcon icon={isDarkTheme ? sunnyOutline : moonOutline} />
            </button>
            <button
              className="quiz-demo-header-action quiz-demo-reset"
              type="button"
              aria-label="Reset quiz"
              title="Reset quiz"
              onClick={resetQuiz}
            >
              <IonIcon icon={refreshOutline} />
            </button>
            <button
              className="quiz-demo-header-action quiz-demo-close"
              type="button"
              aria-label="Close quiz demo"
              onClick={closeDialog}
            >
              <IonIcon icon={close} />
            </button>
          </div>
        </div>

        <div className="quiz-demo-phone-shell">
          <div className="quiz-demo-phone" aria-label="K53 Study Guide quiz preview">
            <div className="quiz-demo-screen">
              <QuizDemoAppHeader
                canGoBack={canGoBack}
                onBackClick={goBackInPreview}
                section={activeTab}
                title={screenTitle}
                subtitle={screenSubtitle}
              />
              <div className="quiz-demo-screen-scroll" ref={screenScrollRef}>
                {activeTab !== "quiz" && <LockedTabContent tab={activeTab} />}

                {activeTab === "quiz" && state.mode === "home" && (
                  <section className="quiz-demo-page quiz-demo-home" aria-label="Quiz settings">
                    <QuizLevelCard
                      level={level}
                      requiredLevelUpExperiencePoints={requiredLevelUpPoints}
                      currentExperiencePercent={progressPercent}
                    />

                    {hasQuizInProgress ? (
                      <div className="quiz-demo-in-progress-card">
                        <div className="quiz-demo-in-progress-top">
                          <span>Current Quiz</span>
                          <ProgressDots questionAnswers={state.questionAnswers} />
                        </div>
                        <strong>{selectedSectionLabel}</strong>
                        <p>{selectedSectionBreadcrumb}</p>
                      </div>
                    ) : (
                      <>
                        <div className="quiz-demo-setting-title">Configure</div>
                        <div className="quiz-demo-settings-card">
                          <button className="quiz-demo-setting-row" type="button" onClick={openNavigator}>
                            <span className="quiz-demo-setting-copy">
                              <span className="quiz-demo-setting-name">Quiz Section</span>
                              {selectedSectionParentBreadcrumb && (
                                <span className="quiz-demo-setting-path">{selectedSectionParentBreadcrumb}</span>
                              )}
                              <strong>{selectedSectionLabel}</strong>
                            </span>
                            <IonIcon icon={chevronForwardOutline} />
                          </button>
                          <label className="quiz-demo-setting-row">
                            <span className="quiz-demo-setting-copy">
                              <span className="quiz-demo-setting-name">Max Questions</span>
                              <strong>
                                <select
                                  value={state.maxQuestions}
                                  onChange={(event) =>
                                    setState({
                                      ...state,
                                      maxQuestions: Number(event.target.value),
                                    })
                                  }
                                >
                                  <option value={5}>5</option>
                                  <option value={10}>10</option>
                                  <option value={15}>15</option>
                                </select>
                              </strong>
                            </span>
                            <IonIcon icon={chevronForwardOutline} />
                          </label>
                        </div>
                      </>
                    )}

                    <div className="quiz-demo-footer">
                      <button className="quiz-demo-primary" type="button" onClick={() => startQuiz()}>
                        {hasQuizInProgress ? "Continue Quiz" : "Start Quiz"}
                        <IonIcon icon={caretForward} />
                      </button>
                      {hasQuizInProgress && (
                        <button className="quiz-demo-secondary" type="button" onClick={resetQuiz}>
                          <IonIcon icon={refreshOutline} />
                          Reset Quiz
                        </button>
                      )}
                    </div>
                  </section>
                )}

                {activeTab === "quiz" && state.mode === "navigator" && (
                  <section className="quiz-demo-page quiz-demo-navigator" aria-label="Select quiz section">
                    <header className="quiz-demo-navigator-header">
                      <span>Choose Quiz Section</span>
                      <h3>{getNavigationLabel(state.navigatorNavigationKey)}</h3>
                      <p>{navigatorBreadcrumb}</p>
                      <div className="quiz-demo-question-pool-card">
                        <strong>Question Pool</strong>
                        <span>
                          {getQuestionPoolCount(state.navigatorNavigationKey)} questions from this section and below
                        </span>
                      </div>
                      <button className="quiz-demo-primary" type="button" onClick={useNavigatorSection}>
                        Use This Section
                        <IonIcon icon={checkmarkCircleOutline} />
                      </button>
                    </header>

                    <div className="quiz-demo-nav-list">
                      {navigatorChildren.map((key, index) => (
                        <QuizNavigatorItem
                          key={key}
                          navigationItemKey={key}
                          correct={0}
                          total={getQuestionPoolCount(key)}
                          index={index}
                          onClick={selectNavigatorChild}
                        />
                      ))}
                      {navigatorChildren.length === 0 && (
                        <div className="quiz-demo-empty-section">This is the deepest section. Use it for your quiz.</div>
                      )}
                    </div>
                  </section>
                )}

                {activeTab === "quiz" && state.mode === "session" && (
                  <section className="quiz-demo-page" aria-label="Quiz session">
                    <QuizDemoHeader
                      currentQuestionIndex={state.currentQuestionIndex}
                      questionAnswers={state.questionAnswers}
                      selectedSectionBreadcrumb={selectedSectionBreadcrumb}
                      selectedSectionLabel={selectedSectionLabel}
                    />
                    {currentQuestionAnswer && (
                      <QuizQuestionCard
                        question={currentQuestionAnswer.question}
                        answer={currentQuestionAnswer.answer}
                        imageAssetBaseUrl={QUESTION_IMAGE_BASE_URL}
                        onOptionClicked={updateAnswer}
                      />
                    )}
                    <div className="quiz-demo-footer">
                      <button className="quiz-demo-primary" type="button" onClick={submitQuiz}>
                        {isLastQuestion ? "Submit" : "Continue"}
                        <IonIcon icon={isLastQuestion ? checkmarkCircleOutline : caretForward} />
                      </button>
                      <button className="quiz-demo-secondary" type="button" onClick={resetQuiz}>
                        <IonIcon icon={refreshOutline} />
                        Reset Quiz
                      </button>
                    </div>
                  </section>
                )}

                {activeTab === "quiz" && state.mode === "results" && (
                  <section className="quiz-demo-page" aria-label="Quiz results">
                    <div className="quiz-demo-result-card">
                      <span>Result</span>
                      <IonIcon className="quiz-demo-result-icon" icon={trophy} />
                      <strong>
                        {totalCorrectAnswers} / {state.questionAnswers.length}
                      </strong>
                      <p>
                        <IonIcon icon={state.experienceGained === 0 ? flashOffOutline : flash} />
                        {state.experienceGained} quiz point{state.experienceGained === 1 ? "" : "s"} gained
                      </p>
                    </div>
                    <div className="quiz-demo-review-title">Review answers</div>
                    <div className="quiz-demo-results-list">
                      {state.questionAnswers.map((questionAnswer, index) => (
                        <div className="quiz-demo-result-item" key={questionAnswer.question.id}>
                          <div className="quiz-demo-question-number">Question {index + 1}</div>
                          <QuizQuestionCard
                            question={questionAnswer.question}
                            answer={questionAnswer.answer}
                            showResult={true}
                            imageAssetBaseUrl={QUESTION_IMAGE_BASE_URL}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="quiz-demo-footer">
                      <button className="quiz-demo-primary" type="button" onClick={() => startQuiz(true)}>
                        Try another quiz
                        <IonIcon icon={refreshOutline} />
                      </button>
                    </div>
                  </section>
                )}
              </div>
              <PreviewTabBar activeTab={activeTab} onTabClick={selectTab} />
            </div>
            <img className="quiz-demo-frame" src={phoneFrameUrl} alt="" aria-hidden="true" />
          </div>
        </div>

        {notice && <div className="quiz-demo-notice">{notice}</div>}
      </div>
    </div>
  );
};

type QuizDemoAppHeaderProps = {
  canGoBack: boolean;
  onBackClick: () => void;
  section: PreviewTab;
  title: string;
  subtitle: string;
};

const QuizDemoAppHeader: React.FC<QuizDemoAppHeaderProps> = ({ canGoBack, onBackClick, section, title, subtitle }) => (
  <header className={`quiz-demo-app-header quiz-demo-app-header-${section}`}>
    <div className="quiz-demo-app-header-bar">
      <div>
        {canGoBack && (
          <button className="quiz-demo-app-back" type="button" aria-label="Go back" onClick={onBackClick}>
            <IonIcon icon={arrowBackOutline} />
          </button>
        )}
      </div>
      <div className="quiz-demo-app-title">
        <strong>{title}</strong>
        {subtitle && <span>{subtitle}</span>}
      </div>
      <div />
    </div>
  </header>
);

type LockedTabContentProps = {
  tab: PreviewTab;
};

const LockedTabContent: React.FC<LockedTabContentProps> = ({ tab }) => {
  const tabLabel = previewTabs.find((item) => item.key === tab)?.label ?? "App";

  return (
    <section className={`quiz-demo-page quiz-demo-locked quiz-demo-locked-${tab}`} aria-label={`${tabLabel} preview`}>
      <div className="quiz-demo-locked-card">
        <span className="quiz-demo-locked-eyebrow">{tabLabel}</span>
        <strong className="quiz-demo-locked-title">Download app for full experience</strong>
        <p>Study mode, mock tests, profile settings, and saved progress live in the full K53 Study Guide app.</p>
        <div className="quiz-demo-store-actions">
          <a
            className="quiz-demo-store-badge"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackStoreCta(`quiz_demo_locked_${tab}_android`)}
          >
            <span className="quiz-demo-store-badge-icon">{"\u25b6"}</span>
            <span className="quiz-demo-store-badge-text">
              <span>Get it on</span>
              <strong>Google Play</strong>
            </span>
          </a>
          <a
            className="quiz-demo-store-badge"
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackStoreCta(`quiz_demo_locked_${tab}_ios`, "ios")}
          >
            <span className="quiz-demo-store-badge-icon quiz-demo-store-badge-apple">{"\uf8ff"}</span>
            <span className="quiz-demo-store-badge-text">
              <span>Download on the</span>
              <strong>App Store</strong>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

type PreviewTabBarProps = {
  activeTab: PreviewTab;
  onTabClick: (tab: PreviewTab) => void;
};

const PreviewTabBar: React.FC<PreviewTabBarProps> = ({ activeTab, onTabClick }) => (
  <div className="quiz-demo-tab-bar" role="navigation" aria-label="Preview sections">
    {previewTabs.map((tab) => (
      <button
        className={activeTab === tab.key ? "quiz-demo-tab-button active" : "quiz-demo-tab-button"}
        key={tab.key}
        type="button"
        onClick={() => onTabClick(tab.key)}
      >
        <span className={`quiz-demo-tab-pill quiz-demo-tab-pill-${tab.key}`}>{tab.label}</span>
      </button>
    ))}
  </div>
);

type QuizDemoHeaderProps = {
  currentQuestionIndex: number;
  questionAnswers: QuestionAnswer[];
  selectedSectionBreadcrumb: string;
  selectedSectionLabel: string;
};

const QuizDemoHeader: React.FC<QuizDemoHeaderProps> = ({
  currentQuestionIndex,
  questionAnswers,
  selectedSectionBreadcrumb,
  selectedSectionLabel,
}) => (
  <header className="quiz-demo-header">
    <h3>{selectedSectionLabel}</h3>
    <p>{selectedSectionBreadcrumb}</p>
    <div className="quiz-demo-progress-card">
      <span>
        Question {currentQuestionIndex + 1} of {questionAnswers.length}
      </span>
      <ProgressDots questionAnswers={questionAnswers} currentQuestionIndex={currentQuestionIndex} />
    </div>
  </header>
);

type ProgressDotsProps = {
  currentQuestionIndex?: number;
  questionAnswers: QuestionAnswer[];
};

const ProgressDots: React.FC<ProgressDotsProps> = ({ currentQuestionIndex, questionAnswers }) => (
  <div className="quiz-demo-progress-dots" aria-hidden="true">
    {questionAnswers.map((questionAnswer, index) => (
      <i
        key={questionAnswer.question.id}
        className={[
          index === currentQuestionIndex ? "active" : "",
          questionAnswer.answer ? "answered" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    ))}
  </div>
);
