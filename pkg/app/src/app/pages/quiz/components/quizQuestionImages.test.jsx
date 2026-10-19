// @vitest-environment jsdom

import { Provider } from "@k53studyguide/shared/translation";
import { cleanup, render } from "@testing-library/react";
import { QuizQuestionCard } from "./QuizQuestionCard";

vi.mock("@ionic/react", () => ({ IonIcon: () => null }));
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

it.each([
  ["/", "/assets/images/road-signs/R1.gif"],
  ["/app/", "/app/assets/images/road-signs/R1.gif"],
  ["/app-preview/", "/app-preview/assets/images/road-signs/R1.gif"],
])("loads question images from the %s mount on nested assessment routes", (base, expected) => {
  vi.stubEnv("BASE_URL", base);
  window.history.replaceState(null, "", `${base}quiz/session`);
  const { container } = render(
    <Provider language="en" translation={{}}>
      <QuizQuestionCard
        question={{
          id: "stop",
          text: "Stop sign",
          image: "road-signs/R1.gif",
          option: [{ id: "stop", value: "Stop" }],
          answer: "stop",
        }}
        answer={null}
      />
    </Provider>,
  );
  expect(new URL(container.querySelector("img").src).pathname).toBe(expected);
});
