import { readFileSync } from "node:fs";
import { afterEach, expect, test, vi } from "vitest";

const html = readFileSync("index.html", "utf8");

const loadWebsite = (url: string, page = html) => {
  // Run the page's shared analytics and inline scripts with build-time environment variables.
  // External analytics SDKs are the observation boundary; no requests are sent.
  globalThis.jsdom.reconfigure({ url });
  document.open();
  document.write(page);
  document.close();
  const posthog = { __loaded: true, init: vi.fn(), capture: vi.fn() };
  Object.assign(window, { posthog, dataLayer: [], gtag: undefined });
  vi.stubGlobal("IntersectionObserver", class { observe() {} });
  window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  for (const script of document.querySelectorAll('script:not([src]), script[src="/src/analytics.js"]')) {
    if (script.type === "application/ld+json") continue;
    const source = (script.getAttribute("src") === "/src/analytics.js" ? readFileSync("src/analytics.js", "utf8") : script.textContent!).replace(
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

afterEach(() => { vi.unstubAllGlobals(); });

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
  ["hero_ios_cta", "ios"],
  ["hero_cta", "android"],
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
  ["k53-road-signs", "road_signs"],
  ["vehicle-controls", "vehicle_controls"],
  ["k53-practice-questions", "practice_questions"],
])("%s keeps both guide referrals attributable and excludes preview traffic", (slug, key) => {
  const page = readFileSync(`${slug}.html`, "utf8");
  for (const host of ["www.k53studyguide.online", "localhost:5173"]) {
    const { gaEvents, posthogEvents } = loadWebsite(`https://${host}/${slug}.html?analytics_test=true`, page);
    const links = document.querySelectorAll<HTMLAnchorElement>('a[data-analytics-location]');
    expect(links).toHaveLength(2);
    links.forEach(link => {
      expect(link.target).toBe("_blank");
      expect(link.rel).toContain("noopener");
      const destination = new URL(link.href);
      if (destination.hostname === "play.google.com") {
        expect(destination.searchParams.get("id")).toBe("deanvniekerk.k53studyguide.app");
        expect(new URLSearchParams(destination.searchParams.get("referrer")!).get("utm_medium")).toBe(`guide_${key}_android`);
      } else {
        expect(destination.hostname).toBe("apps.apple.com");
        expect(destination.pathname).toBe("/us/app/k53-study-guide/id6784718443");
      }
      link.click();
    });
    const expected = host.startsWith("www.") ? ["android", "ios"].map(platform => ({
      cta_location: `guide_${key}_${platform}`, store_platform: platform,
      analytics_environment: "production", analytics_test: true,
    })) : [];
    expect(gaEvents()).toEqual(expected);
    expect(posthogEvents()).toEqual(expected);
  }
});

test("opens full free web study from the homepage without a store referral", () => {
  const { gaEvents, posthogEvents } = loadWebsite("https://www.k53studyguide.online/");
  const link = document.querySelector<HTMLAnchorElement>('a[data-analytics-location="hero_start_free"]');
  expect(link?.textContent).toContain("Start studying free");
  expect(link?.getAttribute("href")).toBe("/app/");
  link!.addEventListener("click", event => event.preventDefault());
  link!.click();
  expect(gaEvents()).toEqual([]);
  expect(posthogEvents()).toEqual([]);
  expect(document.querySelector("[data-quiz-demo-open], #quiz-demo-root")).toBeNull();
});
