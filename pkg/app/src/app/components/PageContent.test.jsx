// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { PageContent } from "./PageContent";

const observerState = vi.hoisted(() => ({ notify: undefined, scroll: undefined, scrollToPoint: vi.fn() }));
const observe = vi.fn();
const disconnect = vi.fn();

vi.mock("@ionic/react", () => ({
  IonContent: ({ children, ref, ...props }) => (
    <div
      {...props}
      ref={(element) => {
        if (element) {
          element.getScrollElement = async () => observerState.scroll;
          element.scrollToPoint = observerState.scrollToPoint;
        }
        ref(element);
      }}
    >
      {children}
    </div>
  ),
  IonIcon: () => <span aria-hidden="true" />,
}));

beforeEach(() => {
  observerState.scroll = document.createElement("div");
  observerState.scroll.getBoundingClientRect = () => ({ bottom: 700 });
  observerState.notify = undefined;
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback) {
        observerState.notify = (bottom) => callback([{ rootBounds: { bottom: 700 }, boundingClientRect: { bottom } }]);
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

async function renderQuestion() {
  const result = render(
    <PageContent scrollHint>
      <button type="button" data-scroll-action>
        Continue
      </button>
    </PageContent>,
  );
  await waitFor(() => expect(observe).toHaveBeenCalledWith(screen.getByText("Continue")));
  return result;
}

it("keeps the fade present without adding an arrow to other pages", () => {
  const { container } = render(<PageContent>Study topics</PageContent>);
  expect(container.querySelector('[slot="fixed"]')).not.toBeNull();
  expect(screen.queryByRole("button")).toBeNull();
  expect(observe).not.toHaveBeenCalled();
});

it("shows the arrow only while the action extends below the viewport", async () => {
  const { container } = await renderQuestion();
  act(() => observerState.notify(900));
  expect(screen.getByRole("button", { name: "Scroll down to the action button" })).toBeTruthy();
  act(() => observerState.notify(700));
  expect(screen.queryByRole("button", { name: "Scroll down to the action button" })).toBeNull();
  expect(container.querySelector('[slot="fixed"]')).not.toBeNull();
  act(() => observerState.notify(-20));
  expect(screen.queryByRole("button", { name: "Scroll down to the action button" })).toBeNull();
});

it.each([
  [false, 300],
  [true, 0],
])("reveals the action on tap and respects reduced motion (%s)", async (reduceMotion, duration) => {
  await renderQuestion();
  vi.stubGlobal("matchMedia", () => ({ matches: reduceMotion }));
  screen.getByText("Continue").getBoundingClientRect = () => ({ bottom: 900 });
  act(() => observerState.notify(900));
  fireEvent.click(screen.getByRole("button", { name: "Scroll down to the action button" }));
  await waitFor(() => expect(observerState.scrollToPoint).toHaveBeenCalledWith(undefined, 248, duration));
});

it("disconnects the observer when leaving the page", async () => {
  const page = await renderQuestion();
  page.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});
