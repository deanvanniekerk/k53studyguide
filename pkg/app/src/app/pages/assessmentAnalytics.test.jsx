// @vitest-environment jsdom
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { cleanup, render } from "@testing-library/react";
import { act } from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import { vi } from "vitest";
import createRootReducer from "@/state/rootReducer";
import { Content } from "./content/components/Content";

vi.mock("@capacitor-firebase/analytics", () => ({ FirebaseAnalytics: { logEvent: vi.fn() } }));
vi.mock("@ionic/react", () => ({
  IonIcon: () => null,
  IonText: ({ children }) => <span>{children}</span>,
  CreateAnimation: ({ children }) => <>{children}</>,
}));
vi.mock("@k53studyguide/shared/translation", () => ({
  Translate: () => null,
  Translator: ({ children }) => children({ translate: ({ text }) => text }),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
beforeEach(() => vi.clearAllMocks());

it("reports study content visibility once per visit without claiming learning completion", () => {
  const store = createStore(createRootReducer(), applyMiddleware(thunk));
  let page;
  let visibility;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback) {
        visibility = (visible) => callback([{ isIntersecting: visible }]);
      }
      observe() {}
      disconnect() {}
    },
  );
  act(() => {
    page = render(
      <Provider store={store}>
        <Content
          item={{ heading: "Road signs", description: "Read about signs" }}
          navigationKey="nav.roadSigns.warning"
        />
      </Provider>,
    );
  });
  act(() => visibility(false));
  expect(store.getState().study.log.seenContentKeys).toEqual({});
  act(() => {
    visibility(true);
    visibility(false);
    visibility(true);
  });
  expect(store.getState().study.log.seenContentKeys).toEqual({ "nav.roadSigns.warning": true });
  expect(vi.mocked(FirebaseAnalytics.logEvent).mock.calls.map(([event]) => event)).toEqual([
    { name: "study_content_view", params: { content_key: "nav.roadSigns.warning", content_category: "nav.roadSigns" } },
  ]);
  act(() => {
    page.unmount();
  });
});
