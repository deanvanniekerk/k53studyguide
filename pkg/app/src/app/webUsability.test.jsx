// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Link, MemoryRouter, Routes } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import createRootReducer from "@/state/rootReducer";
import { recieveLanguage, setTheme } from "@/state/settings";
import Startup from "./Startup";

const environment = vi.hoisted(() => ({ platform: "web", path: "/quiz/session" }));
vi.mock("@capacitor/core", async (original) => ({
  ...(await original()),
  Capacitor: { ...(await original()).Capacitor, getPlatform: () => environment.platform },
}));
vi.mock("@capacitor-firebase/analytics", () => ({
  FirebaseAnalytics: { logEvent: vi.fn(), setUserProperty: vi.fn(), setCurrentScreen: vi.fn() },
}));
vi.mock("@ionic/react-router", () => ({
  IonReactRouter: ({ children }) => <MemoryRouter initialEntries={[environment.path]}>{children}</MemoryRouter>,
}));
vi.mock("@ionic/react", async (original) => {
  const actual = await original();
  const container = ({ children, className, style }) => (
    <div className={className} style={style}>
      {children}
    </div>
  );
  return {
    ...actual,
    ...Object.fromEntries(
      Object.keys(actual)
        .filter((key) => key.startsWith("Ion"))
        .map((key) => [key, container]),
    ),
    IonRouterOutlet: ({ children }) => <Routes>{children}</Routes>,
    IonTabButton: ({ href, children }) => <Link to={href}>{children}</Link>,
    IonIcon: () => null,
    IonButton: ({ children, onClick, disabled, className, ...props }) => (
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={onClick}
        aria-label={props["aria-label"]}
      >
        {children}
      </button>
    ),
    IonModal: ({ children, isOpen }) => (isOpen ? <aside>{children}</aside> : null),
    IonAlert: () => null,
    IonToast: () => null,
    CreateAnimation: ({ children }) => <>{children}</>,
    useIonViewWillEnter: () => {},
    useIonViewWillLeave: () => {},
  };
});

let systemDark = false;
const themeListeners = new Set();
beforeEach(() => {
  environment.platform = "web";
  environment.path = "/quiz/session";
  systemDark = false;
  themeListeners.clear();
  window.matchMedia = () => ({
    matches: systemDark,
    addEventListener: (_, listener) => themeListeners.add(listener),
    removeEventListener: (_, listener) => themeListeners.delete(listener),
  });
  document.head.innerHTML = '<meta name="viewport" content="width=device-width, maximum-scale=1.0, user-scalable=no">';
});
afterEach(() => {
  cleanup();
  document.documentElement.classList.remove("ion-palette-dark");
});

function mount(saved) {
  const reducer = createRootReducer(environment.platform === "web" ? "free_web" : "mobile");
  const initial = reducer(undefined, { type: "@@test/init" });
  const state = saved ?? {
    ...initial,
    settings: {
      ...initial.settings,
      welcomeCompleted: true,
      language: "en",
      theme: "dark",
      displayMode: "comfortable",
    },
    quiz: {
      ...initial.quiz,
      session: {
        ...initial.quiz.session,
        questionAnswers: [
          {
            question: {
              id: "fixture",
              text: "Fixture question",
              answer: "A",
              option: [{ id: "A", value: "Fixture answer" }],
            },
            answer: null,
          },
        ],
      },
    },
  };
  const store = createStore(reducer, state, applyMiddleware(thunk));
  render(
    <Provider store={store}>
      <Startup />
    </Provider>,
  );
  return store;
}

it("loads a selected language without losing an answer and allows web zoom", async () => {
  const store = mount();
  fireEvent.click(screen.getByRole("button", { name: "Fixture answer" }));
  await act(async () => {
    store.dispatch(recieveLanguage("af"));
  });
  await screen.findByRole("link", { name: "Vasvra" });
  expect(document.documentElement.lang).toBe("af");
  expect(document.documentElement.dataset.platform).toBe("web");
  expect(document.querySelector('meta[name="viewport"]').content).not.toContain("user-scalable=no");
  expect(document.documentElement.classList.contains("ion-palette-dark")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Dien in" }));
  expect(screen.getByRole("heading", { name: "Uitslag: 1 / 1" })).toBeTruthy();
});

it("keeps the selected theme across reload and follows system changes only in system mode", async () => {
  let store = mount();
  await act(async () => {});
  const saved = JSON.parse(JSON.stringify(store.getState()));
  cleanup();
  store = mount(saved);
  expect(document.documentElement.classList.contains("ion-palette-dark")).toBe(true);
  act(() => store.dispatch(setTheme("light")));
  expect(document.documentElement.classList.contains("ion-palette-dark")).toBe(false);
  act(() => store.dispatch(setTheme("system")));
  act(() => {
    for (const listener of themeListeners) listener({ matches: true });
  });
  expect(document.documentElement.classList.contains("ion-palette-dark")).toBe(true);
  await waitFor(() => expect(document.querySelector('meta[name="theme-color"]').content).toBe("#13121f"));
});

it("keeps native viewport behavior", async () => {
  environment.platform = "android";
  mount();
  await act(async () => {});
  expect(document.documentElement.dataset.platform).toBe("native");
  expect(document.querySelector('meta[name="viewport"]').content).toContain("user-scalable=no");
});
