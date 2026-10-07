import { readFileSync } from "node:fs";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { Provider as TranslationProvider } from "react-translated";
import { StyleSheetManager } from "styled-components";
import { translations } from "@k53studyguide/shared/data";
import { QuizDemoDialog } from "../src/quiz-demo/QuizDemoDialog";
import { afterEach, expect, test, vi } from "vitest";

const html = readFileSync("index.html", "utf8");

const loadWebsite = (url: string) => {
  // Run the real page's inline scripts with build-time environment variables.
  // External analytics SDKs are the observation boundary; no requests are sent.
  globalThis.jsdom.reconfigure({ url });
  document.open();
  document.write(html);
  document.close();
  const posthog = { __loaded: true, init: vi.fn(), capture: vi.fn() };
  Object.assign(window, { posthog, dataLayer: [], gtag: undefined });
  vi.stubGlobal("IntersectionObserver", class { observe() {} });
  window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  for (const script of document.querySelectorAll("script:not([src])")) {
    if (script.type === "application/ld+json") continue;
    const source = script.textContent!.replace(
      /import\.meta\.env/g,
      JSON.stringify({ VITE_GA_MEASUREMENT_ID: "G-TEST123" }),
    );
    window.eval(`(function () { ${source} })()`);
  }
  const gaEvents = () => (window as any).dataLayer
    .map((args: IArguments) => Array.from(args))
    .filter(([command, event]: string[]) => command === "event" && event === "select_store_cta")
    .map(([, , properties]: unknown[]) => properties);
  const posthogEvents = () => posthog.capture.mock.calls
    .filter(([event]) => event === "select_store_cta")
    .map(([, properties]) => properties);
  return { posthog, gaEvents, posthogEvents };
};

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

test.each(["http://localhost:5173/", "https://preview.example.com/"])(
  "store links still open on %s without starting production collectors",
  (url) => {
    const { posthog, gaEvents, posthogEvents } = loadWebsite(url);
    const link = document.querySelector<HTMLAnchorElement>('a[href*="play.google.com"]')!;
    expect(link.target).toBe("_blank");
    expect(new URL(link.href).searchParams.get("id")).toBe("deanvniekerk.k53studyguide.app");
    link.click();
    expect(gaEvents()).toEqual([]);
    expect(posthogEvents()).toEqual([]);
    expect(posthog.init).not.toHaveBeenCalled();
    expect(document.querySelector('script[src*="googletagmanager.com"]')).toBeNull();
  },
);

const staticReferrals = [
  ["nav_cta", "android"],
  ["hero_cta", "android"],
  ["hero_ios_cta", "ios"],
  ["footer_ios_cta", "ios"],
  ["footer_cta", "android"],
];

test.each(["https://k53studyguide.online/", "https://www.k53studyguide.online/"])(
  "production links at %s preserve destinations and emit one canonical referral per collector",
  (url) => {
    const { gaEvents, posthogEvents } = loadWebsite(url);
    const links = document.querySelectorAll<HTMLAnchorElement>(
      'a[href*="play.google.com"], a[href*="apps.apple.com"]',
    );
    expect(links).toHaveLength(5);
    links.forEach((link, index) => {
      const [location, platform] = staticReferrals[index];
      expect(link.target).toBe("_blank");
      expect(link.rel).toContain("noopener");
      expect(link.rel).toContain("noreferrer");
      if (platform === "android") {
        expect(new URL(link.href).hostname).toBe("play.google.com");
        expect(new URL(link.href).searchParams.get("id")).toBe("deanvniekerk.k53studyguide.app");
      } else {
        expect(new URL(link.href).hostname).toBe("apps.apple.com");
        expect(new URL(link.href).pathname).toBe("/us/app/k53-study-guide/id6784718443");
      }
      link.click();
    });
    const expected = staticReferrals.map(([cta_location, store_platform]) => ({
      cta_location, store_platform, analytics_environment: "production", analytics_test: false,
    }));
    expect(gaEvents()).toEqual(expected);
    expect(posthogEvents()).toEqual(expected);
  },
);

test.each(["analytics_test=true", "utm_source=qa", "utm_campaign=issue7"])(
  "QA links marked with %s remain observable but separable from production referrals",
  (query) => {
    const { gaEvents, posthogEvents } = loadWebsite(`https://www.k53studyguide.online/?${query}`);
    document.querySelector<HTMLAnchorElement>('a[href*="play.google.com"]')!.click();
    const expected = [{
      cta_location: "nav_cta", store_platform: "android",
      analytics_environment: "production", analytics_test: true,
    }];
    expect(gaEvents()).toEqual(expected);
    expect(posthogEvents()).toEqual(expected);
  },
);

test.each([
  { url: "https://www.k53studyguide.online/", isTest: false, collected: true },
  { url: "https://www.k53studyguide.online/?analytics_test=true", isTest: true, collected: true },
  { url: "http://localhost:5173/", isTest: false, collected: false },
])("demo store links preserve all six destinations and collection labels at $url", ({ url, isTest, collected }) => {
  const { gaEvents, posthogEvents } = loadWebsite(url);
  HTMLElement.prototype.scrollTo = vi.fn();
  render(
    <StyleSheetManager target={document.createElement("div")}>
      <TranslationProvider language="en" translation={translations}>
        <QuizDemoDialog />
      </TranslationProvider>
    </StyleSheetManager>,
    { container: document.getElementById("quiz-demo-root")! },
  );
  fireEvent.click(document.querySelector("[data-quiz-demo-open]")!);
  for (const tab of ["Study", "Test", "Profile"]) {
    fireEvent.click(within(document.body).getByRole("button", { name: tab, exact: true }));
    const preview = within(document.body).getByRole("region", { name: `${tab} preview` });
    const android = within(preview).getByRole("link", { name: /Google Play/ }) as HTMLAnchorElement;
    const ios = within(preview).getByRole("link", { name: /App Store/ }) as HTMLAnchorElement;
    expect(new URL(android.href).searchParams.get("id")).toBe("deanvniekerk.k53studyguide.app");
    expect(new URL(ios.href).pathname).toBe("/us/app/k53-study-guide/id6784718443");
    for (const link of [android, ios]) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toContain("noopener");
      fireEvent.click(link);
    }
  }
  const expected = [
    ["quiz_demo_locked_study_android", "android"], ["quiz_demo_locked_study_ios", "ios"],
    ["quiz_demo_locked_test_android", "android"], ["quiz_demo_locked_test_ios", "ios"],
    ["quiz_demo_locked_profile_android", "android"], ["quiz_demo_locked_profile_ios", "ios"],
  ].map(([cta_location, store_platform]) => ({
    cta_location, store_platform, analytics_environment: "production", analytics_test: isTest,
  }));
  expect(gaEvents()).toEqual(collected ? expected : []);
  expect(posthogEvents()).toEqual(collected ? expected : []);
});
