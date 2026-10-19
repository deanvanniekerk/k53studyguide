// @vitest-environment node
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { afterEach, expect, test } from "vitest";
import { generateTopics } from "../scripts/generate-topics.ts";

const temporary: string[] = [];
afterEach(() => {
  for (const dir of temporary.splice(0)) rmSync(dir, { recursive: true, force: true });
});

test("delivers vehicle controls as readable HTML and reuses the deployed app image", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "k53-topics-"));
  temporary.push(outputDir);
  generateTopics({ outputDir, preview: true, appBase: "/app-preview/", imageBase: "/app-preview/assets/images" });
  const document = new JSDOM(readFileSync(join(outputDir, "study/vehicle-controls/index.html"), "utf8")).window
    .document;
  expect(document.querySelectorAll("h1")).toHaveLength(1);
  expect(document.body.textContent).toContain("Press the accelerator down to make the vehicle move");
  expect(document.querySelector("article img")?.getAttribute("src")).toBe(
    "/app-preview/assets/images/rules-of-the-road/vehicleControls.png",
  );
  expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex,follow");
  expect(document.querySelector('a[href="/app-preview/study"]')).not.toBeNull();
  expect(document.querySelector('a[href="/app-preview/quiz"]')).not.toBeNull();
});

test("publishes stable substantive sections, complete metadata and a production-only sitemap", async () => {
  const outputDir = mkdtempSync(join(tmpdir(), "k53-topics-"));
  temporary.push(outputDir);
  const paths = generateTopics({ outputDir });
  const recorded = JSON.parse(readFileSync("scripts/published-topic-urls.json", "utf8"));
  for (const path of paths) expect(recorded).toContain(path);
  await expect(`${paths.join("\n")}\n`).toMatchFileSnapshot("./topics.urls.txt");
  expect(paths).not.toContain("/study/rules-of-the-road/the-driver/cellphones/");
  const driver = new JSDOM(readFileSync(join(outputDir, "study/rules-of-the-road/the-driver/index.html"), "utf8"))
    .window.document;
  expect(driver.body.textContent).toContain("You may not drive while holding a cellphone");
  const robots = readFileSync("public/robots.txt", "utf8");
  const crawlRules = [...robots.matchAll(/^(Allow|Disallow):\s*(.*)$/gm)].map((match) => ({
    allow: match[1] === "Allow",
    path: match[2].trim(),
  }));
  const titles = new Set();
  const descriptions = new Set();
  for (const path of paths) {
    const document = new JSDOM(readFileSync(join(outputDir, `.${path}`, "index.html"), "utf8")).window.document;
    expect(document.documentElement.lang).toBe("en-ZA");
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      `https://www.k53studyguide.online${path}`,
    );
    const description = document.querySelector('meta[name="description"]')!.getAttribute("content")!;
    expect(description.length).toBeGreaterThan(20);
    expect(descriptions.has(description)).toBe(false);
    descriptions.add(description);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(document.querySelector('nav[aria-label="Breadcrumb"]')).not.toBeNull();
    const data = JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!)["@graph"];
    expect(data[0].dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(document.querySelector("time")?.getAttribute("datetime")).toBe(data[0].dateModified);
    expect(data[0].url).toBe(`https://www.k53studyguide.online${path}`);
    expect(data[1].itemListElement.at(-1).item).toBe(data[0].url);
    expect(titles.has(document.title)).toBe(false);
    titles.add(document.title);
    for (const image of document.querySelectorAll("article img")) {
      const src = image.getAttribute("src")!;
      expect(src.startsWith("/app/assets/images/")).toBe(true);
      const applicable = crawlRules
        .filter((rule) => src.startsWith(rule.path))
        .sort((a, b) => b.path.length - a.path.length);
      expect(applicable[0]?.allow, `crawlable image: ${src}`).toBe(true);
      expect(() => readFileSync(join("../app/public", src.slice(4)))).not.toThrow();
    }
    for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="/study/"]')) {
      expect(paths).toContain(new URL(link.href, "https://www.k53studyguide.online").pathname);
    }
  }
  const sitemap = readFileSync(join(outputDir, "public/sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  expect(new Set(urls).size).toBe(urls.length);
  expect(urls).toHaveLength(paths.length + 6);
  expect(urls.some((url) => url.includes("/app"))).toBe(false);
  for (const path of paths) expect(urls).toContain(`https://www.k53studyguide.online${path}`);
  generateTopics({ outputDir, preview: true });
  expect(readFileSync(join(outputDir, "public/sitemap.xml"), "utf8")).not.toContain("/study/");
});

test("the built-link check catches missing files and fragment targets", async () => {
  const { writeFileSync } = await import("node:fs");
  const { checkLinks } = await import("../scripts/check-links.ts");
  const root = mkdtempSync(join(tmpdir(), "k53-links-"));
  temporary.push(root);
  writeFileSync(
    join(root, "index.html"),
    '<h1 id="main">Study</h1><a href="#main">Read</a><a href="#missing">Bad anchor</a><a href="missing.html">Bad page</a><a href="/app/quiz">Practice</a>',
  );
  expect(checkLinks(root)).toEqual(["/index.html: #missing has no anchor", "/index.html: missing.html does not exist"]);
});

test("overwrites retired published topics with a noindex page instead of leaving old FTP content", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "k53-retired-topic-"));
  temporary.push(outputDir);
  const paths = generateTopics({ outputDir, publishedPaths: ["/study/road-signs/retired-section/"] });
  const document = new JSDOM(readFileSync(join(outputDir, "study/road-signs/retired-section/index.html"), "utf8"))
    .window.document;
  expect(document.body.textContent).toContain("This study section has moved");
  expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex,follow");
  expect(document.querySelector('a[href="/study/road-signs/"]')).not.toBeNull();
  expect(paths).not.toContain("/study/road-signs/retired-section/");
  expect(readFileSync(join(outputDir, "public/sitemap.xml"), "utf8")).not.toContain("retired-section");
});
