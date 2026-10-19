// @vitest-environment jsdom
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import { recieveMaxQuestions } from "@/state/quiz/session";
import createRootReducer from "@/state/rootReducer";
import { History, Purchase } from "./pages/profile/components";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResultPage from "./pages/quiz/results/TestResultPage";
import QuizSessionPage from "./pages/quiz/session/TestPage";
import StudyPage from "./pages/study/StudyPage";
import TestPage from "./pages/test/TestPage";

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

beforeEach(() => {
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

function journey(model) {
  const store = createStore(createRootReducer(model), applyMiddleware(thunk));
  store.dispatch(recieveMaxQuestions(1));
  render(
    <Provider store={store}>
      <MemoryRouter basename="/app" initialEntries={["/app/study"]}>
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
    </Provider>,
  );
  return store;
}

it("lets a browser learner study, finish practice and access mock tests and reset without a purchase", async () => {
  const store = journey("free_web");
  expect(screen.getByText("allTopics")).toBeTruthy();
  expect(screen.queryByText("infoStudyResetBody")).toBeNull();
  fireEvent.click(screen.getByRole("link", { name: "Practice" }));
  fireEvent.click(screen.getByRole("button", { name: "startTest" }));
  const question = store.getState().quiz.session.questionAnswers[0].question;
  fireEvent.click(screen.getByText(question.option.find((option) => option.id === question.answer).value));
  fireEvent.click(screen.getByRole("button", { name: "submit" }));
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
  journey("mobile");
  fireEvent.click(screen.getByRole("link", { name: "Mock tests" }));
  expect(screen.getByRole("button", { name: "unlockMockTests" })).toBeTruthy();
  fireEvent.click(screen.getByRole("link", { name: "History" }));
  fireEvent.click(screen.getByRole("button", { name: "clearSeenHistory" }));
  expect(screen.getByRole("alert").textContent).toContain("premiumPackageRequired");
  expect(screen.getByRole("button", { name: "goPremium" })).toBeTruthy();
});
