import { IonIcon } from "@ionic/react";
import { caretForward, checkmarkCircleOutline, close, refreshOutline } from "ionicons/icons";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QuizQuestionCard } from "@k53studyguide/shared/react";
import {
  ROOT_NAVIGATION_KEY,
  buildQuizQuestionAnswers,
  completeQuizSession,
  navigationKeyToBreadcrumb,
  type QuestionAnswer,
  type SuccessfullyAnsweredDates,
} from "@k53studyguide/shared/quiz";
import { navigationData, questionData, type QuestionOption, translations } from "@k53studyguide/shared/data";
import phoneFrameUrl from "../../assets/generated/quiz-phone-frame.png";

type QuizDemoMode = "settings" | "session" | "results";

type QuizDemoState = {
  mode: QuizDemoMode;
  currentQuestionIndex: number;
  targetNavigationKey: string;
  maxQuestions: number;
  questionAnswers: QuestionAnswer[];
  successfullyAnsweredDates: SuccessfullyAnsweredDates;
  experienceGained: number;
  completedAt: string | null;
};

const QUESTION_IMAGE_BASE_URL = "/quiz-assets/images";

const defaultQuizDemoState: QuizDemoState = {
  mode: "settings",
  currentQuestionIndex: 0,
  targetNavigationKey: ROOT_NAVIGATION_KEY,
  maxQuestions: 10,
  questionAnswers: [],
  successfullyAnsweredDates: {},
  experienceGained: 0,
  completedAt: null,
};

const trackAnalyticsEvent = (eventName: string, params: Record<string, string | number | boolean> = {}) => {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", eventName, params);
};

const getTranslation = (key: string): string => translations[key]?.en ?? key;

const sectionOptions = [
  ROOT_NAVIGATION_KEY,
  ...(navigationData[ROOT_NAVIGATION_KEY] ?? []),
].map((key) => ({
  key,
  label: key === ROOT_NAVIGATION_KEY ? "All Content" : getTranslation(key),
}));

export const QuizDemoDialog: React.FC = () => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<QuizDemoState>(defaultQuizDemoState);
  const [notice, setNotice] = useState<string | null>(null);

  const currentQuestionAnswer = state.questionAnswers[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.questionAnswers.length - 1;
  const answeredCount = state.questionAnswers.filter((questionAnswer) => questionAnswer.answer).length;
  const totalCorrectAnswers = state.questionAnswers.filter(
    (questionAnswer) => questionAnswer.answer === questionAnswer.question.answer,
  ).length;
  const hasQuizInProgress = state.questionAnswers.length > 0 && state.mode !== "results";

  const selectedSectionBreadcrumb = useMemo(
    () =>
      navigationKeyToBreadcrumb(state.targetNavigationKey)
        .map((key) => (key === ROOT_NAVIGATION_KEY ? "All Content" : getTranslation(key)))
        .join(" / "),
    [state.targetNavigationKey],
  );

  const updateState = useCallback((nextState: QuizDemoState) => {
    setState(nextState);
  }, []);

  const openDialog = useCallback((location = "unknown") => {
    setIsOpen(true);
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

  const startQuiz = (forceNew = false) => {
    if (!forceNew && hasQuizInProgress) {
      updateState({
        ...state,
        mode: "session",
        completedAt: null,
      });
      trackAnalyticsEvent("quiz_demo_continue", { question_count: state.questionAnswers.length });
      return;
    }

    const questionAnswers = buildQuizQuestionAnswers({
      questionData,
      targetNavigationKey: state.targetNavigationKey,
      maxQuestions: state.maxQuestions,
      successfullyAnsweredDates: state.successfullyAnsweredDates,
    });

    updateState({
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
  };

  const resetQuiz = () => {
    updateState({
      ...state,
      mode: "settings",
      currentQuestionIndex: 0,
      questionAnswers: [],
      experienceGained: 0,
      completedAt: null,
    });
    setNotice("Quiz reset. Pick a section and start again.");
  };

  const updateAnswer = (questionId: string, option: QuestionOption) => {
    updateState({
      ...state,
      questionAnswers: state.questionAnswers.map((questionAnswer) =>
        questionAnswer.question.id === questionId ? { ...questionAnswer, answer: option.id } : questionAnswer,
      ),
    });
  };

  const goToNextQuestion = () => {
    const nextUnansweredIndex = state.questionAnswers.findIndex(
      (questionAnswer, index) => index > state.currentQuestionIndex && !questionAnswer.answer,
    );
    const nextIndex = nextUnansweredIndex >= 0 ? nextUnansweredIndex : state.currentQuestionIndex + 1;

    updateState({
      ...state,
      currentQuestionIndex: Math.min(nextIndex, state.questionAnswers.length - 1),
    });
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

    updateState({
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
          <div>
            <div className="quiz-demo-eyebrow">Download the app for the full experience</div>
            <h2 id="quiz-demo-title">Give the quiz a try!</h2>
          </div>
          <div className="quiz-demo-dialog-actions">
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
              <div className="quiz-demo-screen-scroll">
                {state.mode === "settings" && (
                  <section className="quiz-demo-page quiz-demo-settings" aria-label="Quiz settings">
                    <div className="quiz-demo-level-card">
                      <span>Quiz</span>
                      <strong>{hasQuizInProgress ? "Current quiz saved" : "Practice mode"}</strong>
                      <p>
                        {hasQuizInProgress
                          ? `${answeredCount} of ${state.questionAnswers.length} answered. Continue where you left off.`
                          : "Pick a section and run the same quiz flow used in the app."}
                      </p>
                    </div>

                    <div className="quiz-demo-settings-card">
                      <label className="quiz-demo-field">
                        <span>Quiz section</span>
                        <select
                          value={state.targetNavigationKey}
                          disabled={hasQuizInProgress}
                          onChange={(event) =>
                            updateState({
                              ...state,
                              targetNavigationKey: event.target.value,
                            })
                          }
                        >
                          {sectionOptions.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="quiz-demo-field">
                        <span>Max questions</span>
                        <select
                          value={state.maxQuestions}
                          disabled={hasQuizInProgress}
                          onChange={(event) =>
                            updateState({
                              ...state,
                              maxQuestions: Number(event.target.value),
                            })
                          }
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                        </select>
                      </label>
                    </div>

                    <button className="quiz-demo-primary" type="button" onClick={() => startQuiz()}>
                      {hasQuizInProgress ? "Continue quiz" : "Start quiz"}
                      <IonIcon icon={caretForward} />
                    </button>
                    {hasQuizInProgress && (
                      <button className="quiz-demo-secondary" type="button" onClick={resetQuiz}>
                        <IonIcon icon={refreshOutline} />
                        Reset quiz
                      </button>
                    )}
                  </section>
                )}

                {state.mode === "session" && (
                  <section className="quiz-demo-page" aria-label="Quiz session">
                    <QuizDemoHeader
                      currentQuestionIndex={state.currentQuestionIndex}
                      questionAnswers={state.questionAnswers}
                      selectedSectionBreadcrumb={selectedSectionBreadcrumb}
                      selectedSectionLabel={
                        state.targetNavigationKey === ROOT_NAVIGATION_KEY
                          ? "All Content"
                          : getTranslation(state.targetNavigationKey)
                      }
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
                        Reset quiz
                      </button>
                    </div>
                  </section>
                )}

                {state.mode === "results" && (
                  <section className="quiz-demo-page" aria-label="Quiz results">
                    <div className="quiz-demo-result-card">
                      <span>Result</span>
                      <strong>
                        {totalCorrectAnswers} / {state.questionAnswers.length}
                      </strong>
                      <p>{state.experienceGained} new question{state.experienceGained === 1 ? "" : "s"} mastered.</p>
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
            </div>
            <img className="quiz-demo-frame" src={phoneFrameUrl} alt="" aria-hidden="true" />
          </div>
        </div>

        {notice && <div className="quiz-demo-notice">{notice}</div>}
      </div>
    </div>
  );
};

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
    </div>
  </header>
);
