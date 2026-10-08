// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import { vi } from "vitest";
import { recieveQuestionAnswers, submitTest } from "@/state/quiz/session";
import createRootReducer from "@/state/rootReducer";
import * as mockTest from "@/state/test/session";
import QuizResultPage from "./quiz/results/TestResultPage";
import MockTestResultPage from "./test/results/TestResultPage";

const lifecycle = vi.hoisted(() => ({ leave: new Set(), enter: new Set() }));
vi.mock("@ionic/react", () => ({
  IonPage: ({ children, className }) => <div className={className}>{children}</div>,
  IonIcon: () => null,
  IonCol: ({ children }) => <div>{children}</div>,
  IonRow: ({ children, className }) => <div className={className}>{children}</div>,
  IonGrid: ({ children, className }) => <div className={className}>{children}</div>,
  CreateAnimation: ({ children }) => <>{children}</>,
  useIonViewWillLeave: (callback, deps = []) => {
    useEffect(() => {
      lifecycle.leave.add(callback);
      return () => lifecycle.leave.delete(callback);
    }, deps);
  },
  useIonViewWillEnter: (callback, deps = []) => {
    useEffect(() => {
      lifecycle.enter.add(callback);
      return () => lifecycle.enter.delete(callback);
    }, deps);
  },
}));
vi.mock("@/app/components", () => ({
  PageContent: ({ children, className }) => <main className={className}>{children}</main>,
  PageHeader: ({ title, onBackClick }) => (
    <header>
      {title}
      <button type="button" onClick={onBackClick}>
        Back
      </button>
    </header>
  ),
  PrimaryButton: ({ text, onClick }) => (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  ),
}));
vi.mock("@/app/components/PremiumInvitation", () => ({ PremiumInvitation: () => null }));
vi.mock("@/app/components/Illustration", () => ({ Illustration: () => null }));
vi.mock("@/app/pages/test/TestWatermark", () => ({ TestWatermark: () => null }));
vi.mock("@/app/pages/test/components", () => ({ Tabs: () => null }));
vi.mock("@/app/pages/quiz/QuizWatermark", () => ({ QuizWatermark: () => null }));
vi.mock("@/app/pages/quiz/components", () => ({
  QuizQuestionCard: ({ question, answer }) => (
    <article>
      {question.text}: {answer}
    </article>
  ),
}));
vi.mock("@k53studyguide/shared/translation", () => ({ Translate: ({ text }) => <>{text}</> }));
vi.mock("@/app/hooks/useAnalytics", () => ({ useAnalytics: () => ({}) }));
vi.mock("@/app/hooks/useSuccessfulQuizReviewPrompt", () => ({ useSuccessfulQuizReviewPrompt: () => () => {} }));
vi.mock("@/services/analytics", () => ({ analytics: { trackQuizComplete: vi.fn(), trackMockTestComplete: vi.fn() } }));

afterEach(() => {
  cleanup();
  lifecycle.leave.clear();
  lifecycle.enter.clear();
});

// Retain the result component across routes, as Ionic's per-tab stack does.
function CachedResult({ kind }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = pathname === `/${kind}/results`;
  const wasActive = useRef(false);
  useEffect(() => {
    if (wasActive.current && !active) for (const callback of [...lifecycle.leave]) callback();
    if (!wasActive.current && active) for (const callback of [...lifecycle.enter]) callback();
    wasActive.current = active;
  }, [active]);
  return (
    <>
      <output aria-label="route">{pathname}</output>
      <button type="button" onClick={() => navigate("/study")}>
        Study tab
      </button>
      <button type="button" onClick={() => navigate(`/${kind}/results`)}>
        Return to assessment tab
      </button>
      <div hidden={!active}>{kind === "quiz" ? <QuizResultPage /> : <MockTestResultPage />}</div>
    </>
  );
}

function renderResult(kind, completed = true) {
  const store = createStore(createRootReducer(), applyMiddleware(thunk));
  if (completed) {
    const answer = {
      question: {
        id: "road-sign",
        text: "What does this sign mean?",
        answer: "stop",
        option: [{ id: "stop", value: "Stop" }],
      },
      answer: "stop",
    };
    store.dispatch(
      kind === "quiz"
        ? recieveQuestionAnswers([answer])
        : mockTest.recieveQuestionAnswers([{ ...answer, section: "A" }]),
    );
    store.dispatch(kind === "quiz" ? submitTest() : mockTest.submitTest());
  }
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[`/${kind}/results`]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <CachedResult kind={kind} />
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

it.each(["quiz", "test"])("retains %s results when leaving and re-entering the cached tab", (kind) => {
  const store = renderResult(kind);
  expect(screen.getByRole("article").textContent).toBe("What does this sign mean?: stop");
  const completedAt = store.getState()[kind].session.completedAt;
  fireEvent.click(screen.getByRole("button", { name: "Study tab" }));
  expect(screen.getByLabelText("route").textContent).toBe("/study");
  fireEvent.click(screen.getByRole("button", { name: "Return to assessment tab" }));
  expect(screen.getByRole("article").textContent).toBe("What does this sign mean?: stop");
  expect(store.getState()[kind].session.completedAt).toBe(completedAt);
  if (kind === "quiz") expect(screen.getByRole("heading", { name: "result: 1 / 1" })).toBeTruthy();
});

it.each(["quiz", "test"])("clears %s results only when explicitly returning to its start page", (kind) => {
  const store = renderResult(kind);
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(screen.getByLabelText("route").textContent).toBe(`/${kind}`);
  expect(store.getState()[kind].session.questionAnswers).toEqual([]);
  // A stale cached result route should recover rather than render an empty page.
  fireEvent.click(screen.getByRole("button", { name: "Return to assessment tab" }));
  expect(screen.getByLabelText("route").textContent).toBe(`/${kind}`);
});

it.each(["quiz", "test"])("recovers an empty %s result route on first entry", (kind) => {
  renderResult(kind, false);
  expect(screen.getByLabelText("route").textContent).toBe(`/${kind}`);
});

it.each(["quiz", "test"])("does not redirect away from Study when a cached %s result is cleared", (kind) => {
  const store = renderResult(kind);
  fireEvent.click(screen.getByRole("button", { name: "Study tab" }));
  act(() => store.dispatch(kind === "quiz" ? recieveQuestionAnswers([]) : mockTest.recieveQuestionAnswers([])));
  expect(screen.getByLabelText("route").textContent).toBe("/study");
  fireEvent.click(screen.getByRole("button", { name: "Return to assessment tab" }));
  expect(screen.getByLabelText("route").textContent).toBe(`/${kind}`);
});
