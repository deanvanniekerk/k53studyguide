// @vitest-environment jsdom

import { Provider as TranslationProvider } from "@k53studyguide/shared/translation";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistStore } from "redux-persist";
import { usePremiumOffer } from "@/app/hooks/usePremiumOffer";
import { translations } from "@/data";
import createRootReducer from "@/state/rootReducer";
import { PremiumInvitation } from "./PremiumInvitation";

const storage = vi.hoisted(() => new Map());
vi.mock("@capacitor/preferences", () => ({
  Preferences: {
    get: async ({ key }) => ({ value: storage.get(key) ?? null }),
    set: async ({ key, value }) => storage.set(key, value),
    remove: async ({ key }) => storage.delete(key),
  },
}));
vi.mock("@/app/hooks/usePremiumOffer", () => ({
  usePremiumOffer: vi.fn(() => ({ invitationRef: { current: null }, isOpen: false, open: vi.fn(), dismiss: vi.fn() })),
}));
vi.mock("@/app/modals/PurchaseModal", () => ({ default: () => null }));
vi.mock("./PrimaryButton", () => ({ PrimaryButton: () => <button type="button">Explore premium</button> }));

const persistors = [];
beforeEach(() => {
  storage.clear();
  vi.clearAllMocks();
});
afterEach(() => {
  cleanup();
  persistors.forEach((persistor) => {
    persistor.pause();
  });
  persistors.length = 0;
});

async function startStore() {
  const store = createStore(createRootReducer());
  let persistor;
  await new Promise((resolve) => {
    persistor = persistStore(store, null, resolve);
  });
  persistors.push(persistor);
  return { store, persistor };
}

function mount(store, origin) {
  return render(
    <Provider store={store}>
      <TranslationProvider language="en" translation={translations}>
        <PremiumInvitation origin={origin} />
      </TranslationProvider>
    </Provider>,
  );
}

it("remembers homepage dismissal after settings rehydrate and still shows the results invitation", async () => {
  const first = await startStore();
  const page = mount(first.store, "quiz_home");
  expect(screen.getByText("Ready for a bigger challenge?")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Dismiss premium invitation" }));
  expect(screen.queryByText("Ready for a bigger challenge?")).toBeNull();
  expect(usePremiumOffer).toHaveBeenLastCalledWith("quiz_home", false);
  await first.persistor.flush();
  page.unmount();
  first.persistor.pause();

  const restarted = await startStore();
  expect(restarted.store.getState().settings.quizHomePremiumDismissed).toBe(true);
  mount(restarted.store, "quiz_home");
  expect(screen.queryByText("Ready for a bigger challenge?")).toBeNull();
  mount(restarted.store, "quiz_results");
  expect(screen.getByText("Take the next step: a full mock test")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Dismiss premium invitation" })).toBeNull();
  expect(usePremiumOffer).toHaveBeenLastCalledWith("quiz_results", true);
});

it("shows the homepage invitation for older saved settings", async () => {
  storage.set("persist:settings", JSON.stringify({ language: JSON.stringify("en"), theme: JSON.stringify("light") }));
  const { store } = await startStore();
  mount(store, "quiz_home");
  expect(screen.getByRole("button", { name: "Dismiss premium invitation" })).toBeTruthy();
});
