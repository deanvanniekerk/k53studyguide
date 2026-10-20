// @vitest-environment jsdom

import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act, lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import { recieveMaxQuestions } from "@/state/quiz/session";
import createRootReducer from "@/state/rootReducer";
import { createStorage } from "@/store/store";
import { RetryableImage } from "./components/RetryableImage";
import ContentPage from "./pages/content/ContentPage";
import ProfilePage from "./pages/profile/ProfilePage";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResultPage from "./pages/quiz/results/TestResultPage";
import QuizSessionPage from "./pages/quiz/session/TestPage";
import StudyPage from "./pages/study/StudyPage";
import MockTestResultPage from "./pages/test/results/TestResultPage";
import MockTestSessionPage from "./pages/test/session/TestPage";
import TestPage from "./pages/test/TestPage";
import Startup from "./Startup";
import { WebRuntimeProvider } from "./WebRuntimeProvider";

// Substitute external browser/platform and collector inputs; keep app state/routing real.
vi.hoisted(() => {
  vi.stubGlobal(
    "__FIREBASE_WEB_CONFIG__",
    JSON.stringify({ apiKey: "fixture", projectId: "fixture", appId: "fixture", measurementId: "G-FIXTURE" }),
  );
  vi.stubGlobal("__WEB_ANALYTICS__", "");
  vi.stubGlobal("__SHOW_DEBUG__", false);
  globalThis.jsdom.reconfigure({ url: "https://www.k53studyguide.online/app-preview/?analytics_test=true" });
});
vi.mock("@capacitor/core", async (original) => ({
  ...(await original()),
  Capacitor: { ...(await original()).Capacitor, getPlatform: () => "web", isNativePlatform: () => false },
}));
vi.mock("firebase/app", () => ({ initializeApp: () => ({ name: "[DEFAULT]" }), getApps: () => [] }));
vi.mock("firebase/analytics", () => ({ initializeAnalytics: () => {} }));
afterAll(() => vi.unstubAllGlobals());

vi.mock("@ionic/react-router", () => ({
  IonReactRouter: ({ children }) => <MemoryRouter initialEntries={["/study"]}>{children}</MemoryRouter>,
}));

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
    IonRouterOutlet: ({ children }) => <Routes>{children}</Routes>,
    IonTabButton: ({ children, href }) => <Link to={href}>{children}</Link>,
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
            <Route path="/content" element={<ContentPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz/session" element={<QuizSessionPage />} />
            <Route path="/quiz/results" element={<QuizResultPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/test/results" element={<MockTestResultPage />} />
            <Route path="/test/session" element={<MockTestSessionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
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

it("returns from each main web screen to the website while keeping assessment Back navigation", () => {
  journey("free_web");
  for (const destination of [null, "Practice", "Mock tests", "History"]) {
    if (destination) fireEvent.click(screen.getByRole("link", { name: destination }));
    expect(screen.getByRole("link", { name: "website: backToWebsite" }).getAttribute("href")).toBe("/");
  }
  fireEvent.click(screen.getByRole("link", { name: "Practice" }));
  fireEvent.click(screen.getByRole("button", { name: "startTest" }));
  expect(screen.queryByRole("link", { name: "website: backToWebsite" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "goBack" }));
  expect(screen.getByRole("link", { name: "website: backToWebsite" }).getAttribute("href")).toBe("/");
});

it("lets a browser learner study, finish practice and access mock tests and reset without a purchase", async () => {
  const store = journey("free_web");
  expect(screen.getByText("allTopics")).toBeTruthy();
  expect(screen.queryByText("webProgressBody")).toBeNull();
  expect(screen.queryByText("infoStudyResetBody")).toBeNull();
  finishPractice(store);
  expect(screen.getByRole("heading", { name: "result: 1 / 1" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "premiumSeeOffer" })).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "Mock tests" }));
  expect(screen.getByRole("button", { name: "enterTest" })).toBeTruthy();
  expect(screen.queryByText("premiumOneTime")).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "History" }));
  expect(screen.getByRole("heading", { name: "webProgressTitle" })).toBeTruthy();
  expect(screen.getByText("webProgressBody")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "clearSeenHistory" }));
  expect(screen.getByRole("alert").textContent).toContain("historyCleanSeenConfirm");
  expect(screen.queryByText("goPremium")).toBeNull();
  expect(store.getState().purchase.owned).toBe(false);
  await vi.waitFor(() =>
    expect(FirebaseAnalytics.logEvent.mock.calls.some(([event]) => event.name === "quiz_complete")).toBe(true),
  );
  const events = FirebaseAnalytics.logEvent.mock.calls.map(([event]) => event.name);
  expect(events).toContain("quiz_complete");
  expect(events.some((event) => /^(begin_checkout|checkout_outcome|premium_invitation_)/.test(event))).toBe(false);
});

it("keeps mock tests and history reset locked for a free mobile learner", () => {
  const store = journey("mobile");
  expect(screen.queryByRole("link", { name: "website: backToWebsite" })).toBeNull();
  finishPractice(store);
  expect(screen.queryByRole("link", { name: "Google Play" })).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "Mock tests" }));
  expect(screen.getByRole("button", { name: "unlockMockTests" })).toBeTruthy();
  fireEvent.click(screen.getByRole("link", { name: "History" }));
  expect(screen.queryByText("webProgressBody")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "clearSeenHistory" }));
  expect(screen.getByRole("alert").textContent).toContain("premiumPackageRequired");
  expect(screen.getByRole("button", { name: "goPremium" })).toBeTruthy();
});

it("reports connection loss and recovery without changing saved work or emitting a completion", async () => {
  const store = journey("free_web");
  await act(async () => {});
  finishPractice(store);
  await vi.waitFor(() =>
    expect(FirebaseAnalytics.logEvent.mock.calls.some(([event]) => event.name === "quiz_complete")).toBe(true),
  );
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

it("preserves completed practice through reload and deliberately clears history without changing settings", async () => {
  const store = journey("free_web");
  finishPractice(store);
  await vi.waitFor(() =>
    expect(FirebaseAnalytics.logEvent.mock.calls.filter(([event]) => event.name === "quiz_complete")).toHaveLength(1),
  );
  const saved = JSON.parse(JSON.stringify(store.getState()));
  cleanup();
  const reloaded = journey("free_web", saved, "quiz/results");
  await act(async () => {});
  expect(FirebaseAnalytics.logEvent.mock.calls.filter(([event]) => event.name === "quiz_complete")).toHaveLength(1);
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

it("opens a study topic using the keyboard", async () => {
  journey("free_web");
  const topic = screen.getByRole("button", { name: /nav.vehicleControls/ });
  topic.focus();
  await userEvent.keyboard("{Enter}");
  expect(screen.getByText("nav.vehicleControls.0.heading")).toBeTruthy();
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

it.each(["profile", "quiz_results", "test_results"])(
  "offers optional mobile referrals from web %s",
  async (placement) => {
    if (placement === "quiz_results") {
      finishPractice(journey("free_web"));
    } else if (placement === "test_results") {
      const reducer = createRootReducer("free_web");
      const state = reducer(undefined, { type: "@@test/init" });
      const answer = {
        section: "A",
        answer: "A",
        question: { id: "sign", text: "Sign fixture", answer: "A", option: [{ id: "A", value: "Stop" }] },
      };
      journey(
        "free_web",
        {
          ...state,
          test: { ...state.test, session: { ...state.test.session, questionAnswers: [answer], completedAt: 1 } },
        },
        "test/results",
      );
    } else {
      journey("free_web", undefined, "profile");
    }
    expect(screen.getByText("mobileAppHonesty")).toBeTruthy();
    const referrals = [];
    for (const [name, platform] of [
      ["Google Play", "android"],
      ["App Store", "ios"],
    ]) {
      const link = screen.getByRole("link", { name });
      expect(link.target).toBe("_blank");
      expect(link.rel).toContain("noopener");
      const destination = new URL(link.href);
      const location = `web_app_${placement}_${platform}`;
      if (platform === "android") {
        expect(destination.searchParams.get("id")).toBe("deanvniekerk.k53studyguide.app");
        expect(new URLSearchParams(destination.searchParams.get("referrer")).get("utm_medium")).toBe(location);
      } else {
        expect(destination.pathname).toBe("/us/app/k53-study-guide/id6784718443");
        expect(destination.searchParams.get("ct")).toBe(location);
      }
      link.addEventListener("click", (event) => event.preventDefault());
      fireEvent.click(link);
      referrals.push({
        name: "select_store_cta",
        params: {
          cta_location: location,
          store_platform: platform,
          premium_status: "free",
          analytics_schema_version: "v2",
          analytics_test: "true",
        },
      });
    }
    await Promise.resolve();
    expect(
      FirebaseAnalytics.logEvent.mock.calls
        .map(([event]) => event)
        .filter((event) => event.name === "select_store_cta"),
    ).toEqual(referrals);
    expect(screen.queryByText("goPremium")).toBeNull();
  },
);

it("counts one completed web mock test through result reload and reconnect without purchase signals", async () => {
  const reducer = createRootReducer("free_web");
  const initial = reducer(undefined, { type: "@@test/init" });
  const answers = ["A", "B", "C"].map((section) => ({
    section,
    answer: null,
    question: {
      id: section,
      text: `Question ${section}`,
      answer: "yes",
      option: [{ id: "yes", value: `Answer ${section}` }],
    },
  }));
  const store = journey(
    "free_web",
    {
      ...initial,
      test: {
        ...initial.test,
        session: {
          ...initial.test.session,
          questionAnswers: answers,
          completionAnalyticsVersion: 2,
          completedAt: null,
        },
      },
    },
    "test/session",
  );
  for (const section of ["A", "B", "C"]) {
    fireEvent.click(screen.getByRole("button", { name: `Answer ${section}` }));
    fireEvent.click(screen.getByRole("button", { name: section === "C" ? "submit" : "continue" }));
  }
  const completions = () =>
    FirebaseAnalytics.logEvent.mock.calls
      .map(([event]) => event)
      .filter((event) => event.name === "mock_test_complete");
  await vi.waitFor(() => expect(completions()).toHaveLength(1));
  expect(completions()[0].params).toMatchObject({
    question_count: 3,
    section_a_total: 1,
    section_b_total: 1,
    section_c_total: 1,
    premium_status: "free",
    analytics_schema_version: "v2",
    analytics_test: "true",
  });
  const saved = JSON.parse(JSON.stringify(store.getState()));
  cleanup();
  journey("free_web", saved, "test/results");
  await act(async () => {});
  await act(async () => {
    for (const listener of networkListeners) listener({ connected: false });
  });
  await act(async () => {
    for (const listener of networkListeners) listener({ connected: true });
  });
  expect(screen.getByText("mobileAppResults")).toBeTruthy();
  expect(completions()).toHaveLength(1);
  const events = FirebaseAnalytics.logEvent.mock.calls.map(([event]) => event.name);
  expect(
    events.some((name) =>
      /^(premium_|view_promotion|select_promotion|begin_checkout|checkout_outcome|restore_|purchase_)/.test(name),
    ),
  ).toBe(false);
});

it("sends the ordered free web event journey from startup through study, quiz and a full mock test", async () => {
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  let observed = false;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {
        if (!observed) {
          observed = true;
          this.callback([{ isIntersecting: true }]);
        }
      }
      disconnect() {}
    },
  );
  const reducer = createRootReducer("free_web");
  const initial = reducer(undefined, { type: "@@test/init" });
  const store = createStore(
    reducer,
    {
      ...initial,
      settings: { ...initial.settings, welcomeCompleted: true },
      notifications: {
        notifications: Object.fromEntries(
          Object.keys(initial.notifications.notifications).map((key) => [key, { seen: true }]),
        ),
      },
    },
    applyMiddleware(thunk),
  );
  store.dispatch(recieveMaxQuestions(1));
  render(
    <Provider store={store}>
      <Startup />
    </Provider>,
  );
  fireEvent.click(screen.getByRole("button", { name: /nav.vehicleControls/ }));
  fireEvent.click(screen.getByRole("link", { name: "quiz" }));
  fireEvent.click(screen.getByRole("button", { name: "startTest" }));
  const quizQuestion = store.getState().quiz.session.questionAnswers[0].question;
  fireEvent.click(screen.getByText(quizQuestion.option[0].value));
  fireEvent.click(screen.getByRole("button", { name: "submit" }));
  fireEvent.click(screen.getByRole("link", { name: "test" }));
  fireEvent.click(screen.getByRole("button", { name: "enterTest" }));
  const questions = store.getState().test.session.questionAnswers;
  expect(questions).toHaveLength(64);
  for (const [index, { question }] of questions.entries()) {
    fireEvent.click(screen.getByText(question.option[0].value));
    fireEvent.click(screen.getByRole("button", { name: index === questions.length - 1 ? "submit" : "continue" }));
  }
  await vi.waitFor(() =>
    expect(FirebaseAnalytics.logEvent.mock.calls.some(([event]) => event.name === "mock_test_complete")).toBe(true),
  );
  const events = FirebaseAnalytics.logEvent.mock.calls.map(([event]) => event);
  expect(
    events
      .filter((event) =>
        ["study_content_view", "quiz_start", "quiz_complete", "mock_test_start", "mock_test_complete"].includes(
          event.name,
        ),
      )
      .map((event) => event.name),
  ).toEqual(["study_content_view", "quiz_start", "quiz_complete", "mock_test_start", "mock_test_complete"]);
  expect(events.filter((event) => event.name === "screen_view").map((event) => event.params.firebase_screen)).toEqual([
    "StudyPage",
    "ContentPage",
    "QuizPage",
    "QuizPage:TestPage",
    "QuizPage:TestResultPage",
    "TestPage",
    "TestPage:TestPage",
    "TestPage:TestResultPage",
  ]);
  expect(events.filter((event) => event.name === "app_open")).toHaveLength(1);
  expect(
    events.every(
      (event) =>
        event.params.premium_status === "free" &&
        event.params.analytics_test === "true" &&
        event.params.analytics_schema_version === "v2",
    ),
  ).toBe(true);
  expect(
    events.some((event) =>
      /^(premium_|view_promotion|select_promotion|begin_checkout|checkout_outcome|restore_|purchase_)/.test(event.name),
    ),
  ).toBe(false);
});
