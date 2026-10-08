// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { vi } from "vitest";
import { setDisplayMode, reducer as settings } from "@/state/settings";
import { useStudyDisplayMode } from "./useStudyDisplayMode";

let notifyResize: (() => void) | undefined;
const disconnect = vi.fn();

beforeEach(() => {
  notifyResize = undefined;
  Object.defineProperty(document, "fonts", { configurable: true, value: { ready: Promise.resolve() } });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        notifyResize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function setup(
  availableHeight: number,
  requiredHeight: number,
  savedMode?: "compact" | "comfortable",
  delayContent = false,
) {
  const store = createStore(combineReducers({ settings }));
  if (savedMode) store.dispatch(setDisplayMode(savedMode));
  const scroll = document.createElement("div");
  const layout = document.createElement("div");
  Object.defineProperty(scroll, "clientHeight", { configurable: true, value: availableHeight });
  Object.defineProperty(layout, "offsetHeight", { value: requiredHeight });
  // The entrance animation may overflow even when the actual layout fits.
  Object.defineProperty(scroll, "scrollHeight", { value: requiredHeight + 85 });
  const content = { getScrollElement: async () => scroll };
  const layoutRef = { current: layout };
  const wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>;
  const view = renderHook(({ nativeContent }) => useStudyDisplayMode(nativeContent, layoutRef), {
    wrapper,
    initialProps: { nativeContent: delayContent ? null : content },
  });
  return { store, scroll, attachContent: () => view.rerender({ nativeContent: content }) };
}

it("uses Comfortable when every Study section fits, ignoring entrance animations", async () => {
  const { store } = setup(700, 700);
  await waitFor(() => expect(store.getState().settings.displayMode).toBe("comfortable"));
});

it("falls back to Compact when the Study layout overflows", async () => {
  const { store } = setup(700, 701);
  await waitFor(() => expect(store.getState().settings.displayMode).toBe("compact"));
});

it("waits for a hidden page to have a usable height", async () => {
  const { store, scroll } = setup(0, 700);
  await waitFor(() => expect(notifyResize).toBeDefined());
  expect(store.getState().settings.displayMode).toBeNull();
  Object.defineProperty(scroll, "clientHeight", { value: 750 });
  act(() => notifyResize?.());
  expect(store.getState().settings.displayMode).toBe("comfortable");
});

it("preserves an explicit choice even when the Study page would overflow", async () => {
  const { store } = setup(600, 700, "comfortable");
  await act(async () => {});
  expect(store.getState().settings.displayMode).toBe("comfortable");
});

it("keeps the selected mode when the keyboard or rotation changes the height", async () => {
  const { store, scroll } = setup(750, 700);
  await waitFor(() => expect(store.getState().settings.displayMode).toBe("comfortable"));
  Object.defineProperty(scroll, "clientHeight", { value: 400 });
  act(() => notifyResize?.());
  expect(store.getState().settings.displayMode).toBe("comfortable");
  expect(disconnect).toHaveBeenCalled();
});

it("chooses a default when Ionic attaches its native content after the first effect", async () => {
  const { store, attachContent } = setup(497, 840, undefined, true);
  await act(async () => {});
  expect(store.getState().settings.displayMode).toBeNull();
  attachContent();
  await waitFor(() => expect(store.getState().settings.displayMode).toBe("compact"));
});
