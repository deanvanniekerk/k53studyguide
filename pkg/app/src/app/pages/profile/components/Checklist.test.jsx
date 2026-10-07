import { Provider } from "react-redux";
import { act, create } from "react-test-renderer";
import { Provider as TranslationProvider } from "react-translated";
import { createStore } from "redux";
import { translations } from "@/data";
import createRootReducer from "@/state/rootReducer";
import { Checklist } from "./Checklist";

vi.mock("@ionic/react", () => ({ IonIcon: () => null }));

it("shows Level 0 for a fresh learner using the real translation renderer", () => {
  let page;
  act(() => {
    page = create(
      <Provider store={createStore(createRootReducer())}>
        <TranslationProvider language="en" translation={translations}>
          <Checklist />
        </TranslationProvider>
      </Provider>,
    );
  });
  const values = page.root
    .findAllByType("div")
    .map((node) => node.children.filter((child) => typeof child === "string").join(""));
  expect(values).toContain("Level 0");
  act(() => page.unmount());
});
