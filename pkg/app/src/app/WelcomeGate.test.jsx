// @vitest-environment jsdom

import { questionData } from "@k53studyguide/shared/data";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import createRootReducer from "@/state/rootReducer";
import { completeWelcome, defaultState, reducer } from "@/state/settings";
import { migrateSettings } from "@/state/settings/migration";
import WelcomeGate from "./WelcomeGate";

const device = vi.hoisted(() => ({ native: false, detect: vi.fn() }));
vi.mock("@capacitor/core", () => ({ Capacitor: { isNativePlatform: () => device.native, getPlatform: () => "web" } }));
vi.mock("@capacitor/device", () => ({ Device: { getLanguageTag: device.detect } }));
afterEach(() => {
  cleanup();
  device.native = false;
  device.detect.mockReset();
});

function setup(settings = defaultState) {
  const rootReducer = createRootReducer();
  const initial = rootReducer(undefined, { type: "@@test/init" });
  const original = {
    ...initial,
    settings,
    study: { ...initial.study, log: { ...initial.study.log, seenContentKeys: { kept: true } } },
    quiz: {
      ...initial.quiz,
      session: {
        ...initial.quiz.session,
        questionAnswers: [{ question: Object.values(questionData)[0][0], answer: "B" }],
      },
    },
    purchase: { ...initial.purchase, owned: true },
  };
  const store = createStore(rootReducer, original);
  render(
    <Provider store={store}>
      <WelcomeGate>
        <div>Requested destination</div>
      </WelcomeGate>
    </Provider>,
  );
  return store;
}

it("suggests a browser language, confirms it and preserves study, session and entitlement", async () => {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(["af-ZA"]);
  const store = setup();
  const before = store.getState();
  await waitFor(() => expect(screen.getByRole("radio", { name: "Afrikaans" }).checked).toBe(true));
  expect(screen.queryByText("Requested destination")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByText("Requested destination")).toBeTruthy();
  expect(store.getState()).toEqual({
    ...before,
    settings: { ...defaultState, language: "af", hasSavedLanguage: true, welcomeCompleted: true },
  });
  vi.restoreAllMocks();
});

it("keeps a user selection when native detection finishes late", async () => {
  device.native = true;
  let finish;
  device.detect.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const store = setup();
  fireEvent.click(screen.getByRole("radio", { name: "isiXhosa" }));
  await act(async () => finish({ value: "zu-ZA" }));
  expect(screen.getByRole("radio", { name: "isiXhosa" }).checked).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(store.getState().settings.language).toBe("xh");
});

it("preselects the saved language on upgrade and returns after interruption until confirmed", async () => {
  const legacy = await migrateSettings({ ...defaultState, language: "zu", hasSavedLanguage: undefined });
  const store = setup(legacy);
  expect(screen.getByRole("radio", { name: "isiZulu" }).checked).toBe(true);
  fireEvent.click(screen.getByRole("radio", { name: "Afrikaans" }));
  expect(store.getState().settings.language).toBe("zu");
  cleanup();
  setup(store.getState().settings);
  expect(screen.getByRole("radio", { name: "isiZulu" }).checked).toBe(true);
});

it("bypasses welcome on relaunch after confirmation", () => {
  setup(reducer(defaultState, completeWelcome("xh")));
  expect(screen.getByText("Requested destination")).toBeTruthy();
  expect(screen.queryByRole("radio")).toBeNull();
});

it("falls back to English when native language detection fails", async () => {
  device.native = true;
  device.detect.mockRejectedValue(new Error("Unavailable"));
  setup();
  await act(async () => {});
  expect(screen.getByRole("radio", { name: "English" }).checked).toBe(true);
});
