import { afterEach, expect, test, vi } from "vitest";

const mountDemo = vi.fn();
vi.mock("../src/demo-bootstrap", () => ({ mountDemo }));
afterEach(() => { document.body.innerHTML = ""; vi.resetModules(); vi.clearAllMocks(); });

test("waits for intent, opens once with the originating location, then hands over to the demo", async () => {
  document.body.innerHTML = '<button data-quiz-demo-open data-analytics-location="hero_try_it_now">Try quiz</button>';
  await import("../src/main");
  expect(mountDemo).not.toHaveBeenCalled();
  const trigger = document.querySelector("button")!;
  trigger.click();
  expect(trigger.disabled).toBe(true);
  trigger.click();
  await vi.waitFor(() => expect(mountDemo).toHaveBeenCalledExactlyOnceWith("hero_try_it_now"));
  expect(trigger.disabled).toBe(false);
  expect(trigger.textContent).toBe("Try quiz");
  trigger.click();
  expect(mountDemo).toHaveBeenCalledTimes(1);
});

test("offers a retry after loading fails", async () => {
  document.body.innerHTML = '<button data-quiz-demo-open>Try quiz</button>';
  mountDemo.mockImplementationOnce(() => { throw new Error("Download failed"); });
  await import("../src/main");
  const trigger = document.querySelector("button")!;
  trigger.click();
  await vi.waitFor(() => expect(trigger.textContent).toContain("Try again"));
  expect(trigger.disabled).toBe(false);
  trigger.click();
  await vi.waitFor(() => expect(mountDemo).toHaveBeenCalledTimes(2));
  expect(trigger.textContent).toBe("Try quiz");
});
