// @vitest-environment jsdom

import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act, lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import { recieveMaxQuestions } from "@/state/quiz/session";
import createRootReducer from "@/state/rootReducer";
import { createStorage } from "@/store/store";
import { RetryableImage } from "./components/RetryableImage";
import { History, Purchase } from "./pages/profile/components";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResultPage from "./pages/quiz/results/TestResultPage";
import QuizSessionPage from "./pages/quiz/session/TestPage";
import StudyPage from "./pages/study/StudyPage";
import TestPage from "./pages/test/TestPage";
import { WebRuntimeProvider } from "./WebRuntimeProvider";

// Substitute only the Ionic host widgets, keeping routing, content, UI and Redux real.
vi.mock("@ionic/react", async (original) => {
  const actual = await original();
  const container = ({ children, className, style, onClick }) => (
    <div className={className} style={style} onClick={onClick}>
      {children}
    </div>
  );
  const widgets = Object.fromEntries(
    Object.keys(actual)
      .filter((key) => key.startsWith("Ion"))
      .map((key) => [key, container]),
  );
  return {
    ...actual,
    ...widgets,
    IonIcon: () => null,
    IonButton: ({ children, onClick, disabled, className }) => (
      <button type="button" className={className} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
    IonModal: ({ children, isOpen }) => (isOpen ? <aside>{children}</aside> : null),
    IonToast: ({ message, isOpen }) => (isOpen ? <output>{message}</output> : null),
    IonAlert: ({ isOpen, header, message, buttons }) =>
      isOpen ? (
        <aside role="alert">
          {header}
          {message}
          {buttons.map((button, index) => (
            <button key={index} type="button" onClick={button.handler}>
              {button.text ?? button}
            </button>
          ))}
        </aside>
      ) : null,
    CreateAnimation: ({ children }) => <>{children}</>,
    useIonViewWillEnter: () => {},
    useIonViewWillLeave: () => {},
  };
});
vi.mock("@k53studyguide/shared/translation", async (original) => ({
  ...(await original()),
  useTranslate:
    () =>
    ({ text }) =>
      text,
  Translate: ({ text }) => <>{text}</>,
  Translator: ({ children }) => children({ translate: ({ text }) => text }),
}));
vi.mock("@capacitor-firebase/analytics", () => ({
  FirebaseAnalytics: {
    logEvent: vi.fn().mockResolvedValue(),
    setUserProperty: vi.fn().mockResolvedValue(),
    setCurrentScreen: vi.fn().mockResolvedValue(),
  },
}));

const networkListeners = new Set();
vi.mock("@capacitor/network", () => ({
  Network: {
    getStatus: vi.fn(async () => ({ connected: true })),
    addListener: vi.fn(async (_, listener) => {
      networkListeners.add(listener);
      return { remove: async () => networkListeners.delete(listener) };
    }),
  },
}));

beforeEach(() => {
  networkListeners.clear();
  vi.clearAllMocks();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(cleanup);

function journey(model, preloaded, entry = "study") {
  const store = createStore(createRootReducer(model), preloaded, applyMiddleware(thunk));
  if (!preloaded) store.dispatch(recieveMaxQuestions(1));
  render(
    <Provider store={store}>
      <WebRuntimeProvider>
        <MemoryRouter basename="/app" initialEntries={[`/app/${entry}`]}>
          <nav>
            <Link to="/quiz">Practice</Link>
            <Link to="/test">Mock tests</Link>
            <Link to="/profile">History</Link>
          </nav>
          <Routes>
            <Route path="/study" element={<StudyPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz/session" element={<QuizSessionPage />} />
            <Route path="/quiz/results" element={<QuizResultPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route
              path="/profile"
              element={
                <>
                  <History />
                  <Purchase />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </WebRuntimeProvider>
    </Provider>,
  );
  return store;
}

function finishPractice(store) {
  fireEvent.click(screen.getByRole("link", { name: "Practice" }));
  fireEvent.click(screen.getByRole("button", { name: "startTest" }));
  const question = store.getState().quiz.session.questionAnswers[0].question;
  fireEvent.click(screen.getByText(question.option.find((option) => option.id === question.answer).value));
  fireEvent.click(screen.getByRole("button", { name: "submit" }));
}

it("lets a browser learner study, finish practice and access mock tests and reset without a purchase", async () => {
  const store = journey("free_web");
  expect(screen.getByText("allTopics")).toBeTruthy();
  expect(screen.getByText("webProgressBody")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "webProgressDismiss" }));
  expect(screen.queryByText("webProgressBody")).toBeNull();
  expect(screen.queryByText("infoStudyResetBody")).toBeNull();
  finishPractice(store);
  expect(screen.getByRole("heading", { name: "result: 1 / 1" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "premiumSeeOffer" })).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "Mock tests" }));
  expect(screen.getByRole("button", { name: "enterTest" })).toBeTruthy();
  expect(screen.queryByText("premiumOneTime")).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "History" }));
  fireEvent.click(screen.getByRole("button", { name: "clearSeenHistory" }));
  expect(screen.getByRole("alert").textContent).toContain("historyCleanSeenConfirm");
  expect(screen.queryByText("goPremium")).toBeNull();
  expect(store.getState().purchase.owned).toBe(false);
  await Promise.resolve();
  const events = FirebaseAnalytics.logEvent.mock.calls.map(([event]) => event.name);
  expect(events).toContain("quiz_complete");
  expect(events.some((event) => /^(begin_checkout|checkout_outcome|premium_invitation_)/.test(event))).toBe(false);
});

it("keeps mock tests and history reset locked for a free mobile learner", () => {
  const store = journey("mobile");
  finishPractice(store);
  fireEvent.click(screen.getByRole("link", { name: "Mock tests" }));
  expect(screen.getByRole("button", { name: "unlockMockTests" })).toBeTruthy();
  fireEvent.click(screen.getByRole("link", { name: "History" }));
  fireEvent.click(screen.getByRole("button", { name: "clearSeenHistory" }));
  expect(screen.getByRole("alert").textContent).toContain("premiumPackageRequired");
  expect(screen.getByRole("button", { name: "goPremium" })).toBeTruthy();
});

it("reports connection loss and recovery without changing saved work or emitting a completion", async () => {
  const store = journey("free_web");
  await act(async () => {});
  finishPractice(store);
  await createStorage().setItem("persist:quiz-session", JSON.stringify(store.getState().quiz.session));
  const savedStorage = Object.fromEntries(Object.entries(localStorage));
  const before = JSON.stringify(store.getState());
  const events = FirebaseAnalytics.logEvent.mock.calls.length;
  await act(async () => {
    for (const listener of networkListeners) listener({ connected: false });
  });
  expect(screen.getByRole("status").textContent).toContain("webOffline");
  await act(async () => {
    for (const listener of networkListeners) listener({ connected: true });
  });
  expect(screen.queryByText("webOffline")).toBeNull();
  expect(JSON.stringify(store.getState())).toBe(before);
  expect(Object.fromEntries(Object.entries(localStorage))).toEqual(savedStorage);
  expect(FirebaseAnalytics.logEvent.mock.calls.length).toBe(events);
});

it("preserves completed practice through reload and deliberately clears history without changing settings", () => {
  const store = journey("free_web");
  finishPractice(store);
  const saved = JSON.parse(JSON.stringify(store.getState()));
  cleanup();
  const reloaded = journey("free_web", saved, "quiz/results");
  expect(screen.getByRole("heading", { name: "result: 1 / 1" })).toBeTruthy();
  fireEvent.click(screen.getByRole("link", { name: "History" }));
  fireEvent.click(screen.getByRole("button", { name: "clearQuizHistory" }));
  fireEvent.click(screen.getByRole("button", { name: "yes" }));
  const cleared = JSON.parse(JSON.stringify(reloaded.getState()));
  cleanup();
  const afterReset = journey("free_web", cleared);
  expect(afterReset.getState().quiz.log).toEqual(expect.objectContaining({ quesionsSuccesfullyAnsweredDates: {} }));
  expect(afterReset.getState().settings).toEqual(saved.settings);
});

it("retries a failed image manually and after reconnecting", async () => {
  const store = createStore(createRootReducer("free_web"), applyMiddleware(thunk));
  const { container } = render(
    <Provider store={store}>
      <WebRuntimeProvider>
        <RetryableImage src="/app/assets/images/road-signs/R1.gif" alt="Stop sign" />
      </WebRuntimeProvider>
    </Provider>,
  );
  await act(async () => {});
  fireEvent.error(screen.getByRole("img", { name: "Stop sign" }));
  expect(screen.getByRole("button", { name: "webImageRetry" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "webImageRetry" }));
  expect(screen.getByRole("img", { name: "Stop sign" })).toBeTruthy();
  fireEvent.error(screen.getByRole("img", { name: "Stop sign" }));
  await act(async () => {
    for (const listener of networkListeners) listener({ connected: false });
  });
  await act(async () => {
    for (const listener of networkListeners) listener({ connected: true });
  });
  expect(screen.queryByRole("button", { name: "webImageRetry" })).toBeNull();
  expect(container.querySelector("img").hidden).toBe(false);
});

it("offers recovery when a lazy application update cannot load", async () => {
  journey("free_web");
  await act(async () => {});
  const event = new Event("vite:preloadError", { cancelable: true });
  act(() => window.dispatchEvent(event));
  expect(event.defaultPrevented).toBe(false);
  expect(screen.getByText("webChunkFailed")).toBeTruthy();
  expect(screen.getByRole("button", { name: "webReload" })).toBeTruthy();
  expect(screen.getByText("allTopics")).toBeTruthy();
});

it("remembers dismissal of the first browser progress notice after reload", () => {
  const store = journey("free_web");
  fireEvent.click(screen.getByRole("button", { name: "webProgressDismiss" }));
  const saved = JSON.parse(JSON.stringify(store.getState()));
  cleanup();
  journey("free_web", saved);
  expect(screen.queryByText("webProgressBody")).toBeNull();
});

it("keeps a failed lazy route recoverable without losing the saved learner state", async () => {
  const store = createStore(createRootReducer("free_web"), applyMiddleware(thunk));
  let rejectLoad;
  const Page = lazy(
    () =>
      new Promise((_, reject) => {
        rejectLoad = reject;
      }),
  );
  const errors = vi.spyOn(console, "error").mockImplementation(() => {});
  render(
    <Provider store={store}>
      <WebRuntimeProvider>
        <Suspense fallback="Loading route">
          <Page />
        </Suspense>
      </WebRuntimeProvider>
    </Provider>,
  );
  const before = JSON.stringify(store.getState());
  await act(async () => {
    window.dispatchEvent(new Event("vite:preloadError"));
    rejectLoad(new Error("Failed to fetch dynamically imported module"));
  });
  expect(screen.getByText("webChunkFailed")).toBeTruthy();
  expect(screen.getByRole("button", { name: "webReload" })).toBeTruthy();
  expect(JSON.stringify(store.getState())).toBe(before);
  errors.mockRestore();
});

it("keeps Study usable and warns when a browser save fails", async () => {
  const store = journey("free_web");
  const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Quota exceeded", "QuotaExceededError");
  });
  await act(async () => {
    await createStorage().setItem("persist:quiz-session", "{}");
  });
  expect(screen.getByRole("alert").textContent).toContain("webStorageUnavailable");
  expect(screen.getByText("allTopics")).toBeTruthy();
  finishPractice(store);
  expect(screen.getByRole("heading", { name: "result: 1 / 1" })).toBeTruthy();
  expect(store.getState().purchase.owned).toBe(false);
  setItem.mockRestore();
});
