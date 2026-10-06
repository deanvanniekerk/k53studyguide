import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { Provider } from "react-redux";
import { act, create } from "react-test-renderer";
import VisibilitySensor from "react-visibility-sensor";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import { vi } from "vitest";
import { recieveQuestionAnswers } from "@/state/quiz/session";
import createRootReducer from "@/state/rootReducer";
import { recieveQuestionAnswers as receiveMockQuestions } from "@/state/test/session";
import { Content } from "./content/components/Content";
import { Header as QuizResults } from "./quiz/results/components/Header";
import { Header as MockResults } from "./test/results/components/Header";

vi.mock("@capacitor-firebase/analytics", () => ({ FirebaseAnalytics: { logEvent: vi.fn() } }));
vi.mock("@ionic/react", () => ({
  IonIcon: () => null,
  IonText: ({ children }) => <span>{children}</span>,
  CreateAnimation: ({ children }) => <>{children}</>,
}));
vi.mock("react-translated", () => ({
  Translate: () => null,
  Translator: ({ children }) => children({ translate: ({ text }) => text }),
}));
vi.mock("react-visibility-sensor", () => ({ default: ({ children }) => <>{children}</> }));
beforeEach(() => vi.clearAllMocks());

it("viewing and revisiting empty or historical assessment results never records a completion", () => {
  const store = createStore(createRootReducer(), applyMiddleware(thunk));
  let page;
  const showResults = () => (
    <Provider store={store}>
      <QuizResults />
      <MockResults />
    </Provider>
  );
  act(() => {
    page = create(showResults());
  });
  act(() => {
    page.unmount();
  });
  const oldQuestion = { question: { id: "old", answer: "B", text: "old", option: [] }, answer: "A" };
  store.dispatch(recieveQuestionAnswers([oldQuestion]));
  store.dispatch(receiveMockQuestions([{ ...oldQuestion, section: "A" }]));
  act(() => {
    page = create(showResults());
  });
  act(() => {
    page.unmount();
  });
  act(() => {
    page = create(showResults());
  });
  act(() => {
    page.unmount();
  });
  expect(vi.mocked(FirebaseAnalytics.logEvent).mock.calls).toEqual([]);
});

it("reports study content visibility once per visit without claiming learning completion", () => {
  const store = createStore(createRootReducer(), applyMiddleware(thunk));
  let page;
  act(() => {
    page = create(
      <Provider store={store}>
        <Content
          item={{ heading: "Road signs", description: "Read about signs" }}
          navigationKey="nav.roadSigns.warning"
        />
      </Provider>,
    );
  });
  const visibility = page.root.findByType(VisibilitySensor).props.onChange;
  act(() => {
    visibility(false);
    visibility(true);
    visibility(false);
    visibility(true);
  });
  expect(vi.mocked(FirebaseAnalytics.logEvent).mock.calls.map(([event]) => event)).toEqual([
    { name: "study_content_view", params: { content_key: "nav.roadSigns.warning", content_category: "nav.roadSigns" } },
  ]);
  act(() => {
    page.unmount();
  });
});
