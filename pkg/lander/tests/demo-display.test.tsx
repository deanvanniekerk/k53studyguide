import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider as TranslationProvider } from "@k53studyguide/shared/translation";
import { translations } from "@k53studyguide/shared/data";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { QuizDemoDialog } from "../src/quiz-demo/QuizDemoDialog";

const observers: { notify: (bottom: number) => void; disconnect: ReturnType<typeof vi.fn> }[] = [];

beforeEach(() => {
  document.body.innerHTML = '<button data-quiz-demo-open>Try quiz</button>';
  document.documentElement.dataset.displayMode = "compact";
  observers.length = 0;
  window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  HTMLElement.prototype.scrollTo = vi.fn();
  vi.stubGlobal("IntersectionObserver", class {
    disconnect = vi.fn();
    constructor(callback: IntersectionObserverCallback) {
      observers.push({
        notify: (bottom) => callback([{ rootBounds: { bottom: 700 }, boundingClientRect: { bottom } } as IntersectionObserverEntry], this as unknown as IntersectionObserver),
        disconnect: this.disconnect,
      });
    }
    observe() {}
  });
});

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.displayMode;
  vi.unstubAllGlobals();
});

const openDemo = () => {
  render(<TranslationProvider language="en" translation={translations}><QuizDemoDialog /></TranslationProvider>);
  fireEvent.click(screen.getByText("Try quiz"));
};

test("keeps the visitor's display choice across reopening while restoring the website's root settings", () => {
  openDemo();
  expect(document.documentElement.dataset.displayMode).toBe("compact");
  fireEvent.click(screen.getByRole("button", { name: "Switch to comfortable display mode" }));
  expect(document.documentElement.dataset.displayMode).toBe("comfortable");
  fireEvent.click(screen.getByRole("button", { name: "Close quiz demo" }));
  expect(document.documentElement.dataset.displayMode).toBe("compact");
  fireEvent.click(screen.getByText("Try quiz"));
  expect(document.documentElement.dataset.displayMode).toBe("comfortable");
});

test("reobserves the action when navigating and reveals it from the shared arrow", async () => {
  openDemo();
  await waitFor(() => expect(observers.length).toBe(1));
  const first = observers[0];
  act(() => first.notify(900));
  const viewport = document.querySelector<HTMLElement>(".quiz-demo-screen-scroll")!;
  viewport.getBoundingClientRect = () => ({ bottom: 700 } as DOMRect);
  document.querySelector<HTMLElement>("[data-scroll-action]")!.getBoundingClientRect = () => ({ bottom: 900 } as DOMRect);
  fireEvent.click(screen.getByRole("button", { name: "Scroll down to the action button" }));
  expect(viewport.scrollTo).toHaveBeenCalledWith({ top: 248, behavior: "smooth" });
  fireEvent.click(screen.getByRole("button", { name: /Quiz Section/ }));
  await waitFor(() => expect(observers.length).toBe(2));
  expect(first.disconnect).toHaveBeenCalledOnce();
  act(() => observers[1].notify(700));
  expect(screen.queryByRole("button", { name: "Scroll down to the action button" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Study", exact: true }));
  expect(observers[1].disconnect).toHaveBeenCalledOnce();
});
