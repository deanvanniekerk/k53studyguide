// @vitest-environment jsdom

import { Provider, Translate, Translator } from "@k53studyguide/shared/translation";
import { cleanup, render, screen } from "@testing-library/react";

afterEach(cleanup);
it("updates language and interpolates progress and HTML through the shared translation boundary", () => {
  const translation = {
    greeting: { en: "Hello {name}", af: "Hallo {name}" },
    description: { en: "<p>Read <b>{count}</b> signs</p>", af: "<p>Lees <b>{count}</b> tekens</p>" },
  };
  const content = (language) => (
    <Provider language={language} translation={translation}>
      <h1>
        <Translate text="greeting" data={{ name: "Dean" }} />
      </h1>
      <p>
        <Translate text="Literal fallback" />
      </p>
      <Translator>
        {({ translate }) => (
          <article dangerouslySetInnerHTML={{ __html: translate({ text: "description", data: { count: 3 } }) }} />
        )}
      </Translator>
    </Provider>
  );
  const page = render(content("en"));
  expect(screen.getByText("Hello Dean")).toBeTruthy();
  expect(screen.getByText("Literal fallback")).toBeTruthy();
  expect(screen.getByRole("article").textContent).toBe("Read 3 signs");
  page.rerender(content("af"));
  expect(screen.getByText("Hallo Dean")).toBeTruthy();
  expect(screen.getByRole("article").textContent).toBe("Lees 3 tekens");
});
