/**
 * Static English study pages share the app's content. Publish a section when its
 * subtree has >=3 items or >=150 words; fold smaller children into their parent.
 * Preview is the safe CLI default. TOPIC_PREVIEW=0 is an explicit launch step.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { contentData } from "../../shared/src/data/content.ts";
import { navigationData } from "../../shared/src/data/navigationLookup.ts";
import { translations } from "../../shared/src/data/translations.ts";

const lander = fileURLToPath(new URL("../", import.meta.url));
const host = "https://www.k53studyguide.online";
const areaSlugs: Record<string, string> = {
  signs: "road-signs",
  rulesOfTheRoad: "rules-of-the-road",
  vehicleControls: "vehicle-controls",
  defensiveDriving: "defensive-driving",
  roadMarkings: "road-markings",
  roadSignals: "road-signals",
};
const enabledAreas = ["nav.signs", "nav.rulesOfTheRoad", "nav.vehicleControls"];
const text = (key: string) => translations[key]?.en ?? "";
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const plain = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
function excerpt(value: string, limit: number): string {
  const normalized = plain(value);
  if (normalized.length <= limit) return normalized;
  const candidate = normalized.slice(0, limit - 1);
  const sentence = candidate.lastIndexOf(". ");
  if (sentence >= 60) return candidate.slice(0, sentence + 1);
  const word = candidate.lastIndexOf(" ");
  return `${candidate.slice(0, word > 0 ? word : candidate.length).trimEnd()}…`;
}
const slug = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
type Topic = { key: string; name: string; path: string; children: Topic[]; published: boolean };
type Options = {
  outputDir: string;
  preview?: boolean;
  appBase?: string;
  imageBase?: string;
  publishedPaths?: string[];
};

function tree(key: string, path: string, area = false): Topic {
  const children = (navigationData[key] ?? []).map((child) => tree(child, `${path}${slug(child.split(".").at(-1)!)}/`));
  const topic = { key, path, name: text(key), children, published: area };
  const items = allItems(topic);
  topic.published ||=
    items.length >= 3 || plain(items.map((item) => text(item.description)).join(" ")).split(/\s+/).length >= 150;
  return topic;
}
function allItems(topic: Topic): (typeof contentData)[string] {
  return [...(contentData[topic.key] ?? []), ...topic.children.flatMap(allItems)];
}
function pagesBelow(topic: Topic): Topic[] {
  return topic.published ? [topic, ...topic.children.flatMap(pagesBelow)] : [];
}

export function generateTopics({
  outputDir,
  preview = false,
  appBase = "/app/",
  imageBase = "/app/assets/images",
  publishedPaths = JSON.parse(readFileSync(resolve(lander, "scripts/published-topic-urls.json"), "utf8")),
}: Options): string[] {
  const base = `${appBase.replace(/\/$/, "")}/`;
  const imageRoot = imageBase.replace(/\/$/, "");
  const studyHref = `${base}study`;
  const practiceHref = `${base}quiz`;
  const roots = enabledAreas.map((key) => tree(key, `/study/${areaSlugs[key.split(".")[1]]}/`, true));
  const hub: Topic = { key: "study", name: "K53 study topics", path: "/study/", children: roots, published: true };
  const pages = [hub, ...roots.flatMap(pagesBelow)];
  const lastmod = execFileSync(
    "git",
    [
      "log",
      "-1",
      "--format=%cs",
      "--",
      "pkg/shared/src/data/content.ts",
      "pkg/shared/src/data/translations.ts",
      "pkg/shared/src/data/navigationLookup.ts",
    ],
    { cwd: resolve(lander, "../.."), encoding: "utf8" },
  ).trim();
  const guide = readFileSync(resolve(lander, "k53-road-signs.html"), "utf8");
  const shell = (tag: string) =>
    guide
      .match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`))![0]
      .replace(/(href|src)="(assets\/|privacy.html|terms.html|k53-|vehicle-controls.html)/g, '$1="/$2');
  const footer = shell("footer");
  const nav = `<nav aria-label="Main navigation"><div class="nav-inner container"><a class="nav-logo" href="/"><img src="/assets/logo.png" width="36" height="36" alt="" />K53 Study Guide</a><a class="guide-app-link" href="${escapeHtml(studyHref)}">Start studying free ↗</a></div></nav>`;
  function content(topic: Topic, depth = 2): string {
    const heading = Math.min(depth, 6);
    const own = (contentData[topic.key] ?? [])
      .map(
        (item) =>
          `<section><h${heading}>${escapeHtml(text(item.heading))}</h${heading}>${item.imageName ? `<img class="topic-image" src="${escapeHtml(`${imageRoot}/${item.imageName}`)}" alt="${escapeHtml(text(item.heading))}" loading="lazy" />` : ""}<div>${text(item.description)}</div></section>`,
      )
      .join("\n");
    return (
      own +
      topic.children
        .map((child) =>
          child.published
            ? `<section><h${heading}><a href="${child.path}">${escapeHtml(child.name)}</a></h${heading}><p>${escapeHtml(excerpt(text(allItems(child)[0]?.description ?? ""), 220))}</p></section>`
            : `<section id="${slug(child.key.split(".").at(-1)!)}"><h${heading}>${escapeHtml(child.name)}</h${heading}>${content(child, heading + 1)}</section>`,
        )
        .join("\n")
    );
  }
  rmSync(resolve(outputDir, "study"), { recursive: true, force: true });
  for (const [index, page] of pages.entries()) {
    const area = roots.find((root) => page.path.startsWith(root.path));
    const ancestors = pages.filter((candidate) => candidate.path !== page.path && page.path.startsWith(candidate.path));
    const breadcrumbs = [
      { name: "K53 Study Guide", path: "/" },
      ...ancestors.map(({ name, path }) => ({ name, path })),
      page,
    ];
    const siblings = ancestors.at(-1)?.children.filter((child) => child.published) ?? roots;
    const title = [page.name, ...(area && area !== page ? [area.name] : []), "K53 Study Guide"].join(" | ");
    const description = excerpt(
      `${page.name}: ${plain(text(allItems(page)[0]?.description ?? "")) || "Read the K53 study material and practise in the free web app. Explore road signs, rules of the road and vehicle controls."}`,
      155,
    );
    const canonical = host + page.path;
    const structured = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${canonical}#page`,
          url: canonical,
          name: title,
          description,
          inLanguage: "en-ZA",
          dateModified: lastmod,
          isPartOf: { "@id": `${host}/#website` },
          publisher: { "@id": `${host}/#publisher` },
          breadcrumb: { "@id": `${canonical}#breadcrumbs` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumbs`,
          itemListElement: breadcrumbs.map((crumb, position) => ({
            "@type": "ListItem",
            position: position + 1,
            name: crumb.name,
            item: host + crumb.path,
          })),
        },
      ],
    };
    const adjacent = [pages[index - 1], pages[index + 1]]
      .map((entry, i) =>
        entry
          ? `<a rel="${i === 0 ? "prev" : "next"}" href="${entry.path}">${i === 0 ? "Previous" : "Next"}: ${escapeHtml(entry.name)}</a>`
          : "",
      )
      .join(" ");
    const html = `<!DOCTYPE html>
<html lang="en-ZA"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}" />
<meta name="robots" content="${preview ? "noindex,follow" : "index,follow"}" /><link rel="canonical" href="${canonical}" />
<meta property="og:type" content="website" /><meta property="og:site_name" content="K53 Study Guide" />
<meta property="og:title" content="${escapeHtml(title)}" /><meta property="og:description" content="${escapeHtml(description)}" /><meta property="og:url" content="${canonical}" /><meta property="og:image" content="${host}/assets/k53-social.jpg" />
<meta name="twitter:card" content="summary_large_image" /><meta name="theme-color" content="#111128" />
<link rel="icon" type="image/png" href="/assets/favicon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/src/landing.css" /><link rel="stylesheet" href="/src/guides.css" />
<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, "\\u003c")}</script>
${preview ? "" : '<script type="module" src="/src/analytics.js"></script>'}
</head><body><a class="skip-link" href="#main">Skip to content</a>${nav}
<main id="main"><header class="guide-header container"><nav aria-label="Breadcrumb" class="topic-breadcrumb">${breadcrumbs.map((crumb) => `<a href="${crumb.path}"${crumb.path === page.path ? ' aria-current="page"' : ""}>${escapeHtml(crumb.name)}</a>`).join(" / ")}</nav><h1>${escapeHtml(page.name)}</h1><p class="guide-intro">${escapeHtml(description)}</p><p class="guide-byline">By K53 Study Guide · Updated <time datetime="${lastmod}">${lastmod}</time></p></header>
<div class="guide-layout container"><article class="guide-body">${content(page)}<nav class="topic-pagination" aria-label="Adjacent sections">${adjacent}</nav></article>
<aside class="guide-aside" aria-label="More study resources"><p class="eyebrow">Browse topics</p><div class="guide-related">${siblings.map((sibling) => `<a href="${sibling.path}"${sibling.path === page.path ? ' aria-current="page"' : ""}>${escapeHtml(sibling.name)}</a>`).join("")}</div><div class="guide-app"><h2>Put your knowledge into practice.</h2><p>Study and practise for free in your browser. Your progress stays in this browser.</p><a class="button" href="${escapeHtml(studyHref)}">Study this in the free web app</a><a class="button" href="${escapeHtml(practiceHref)}">Practise this topic</a></div></aside></div></main>${footer}</body></html>`;
    const target = resolve(outputDir, `.${page.path}`, "index.html");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, html);
  }
  // FTP uploads do not remove old files. Overwrite retired URLs with noindex
  // replacement pages on every build; the published-route record only grows.
  const activePaths = new Set(pages.map((page) => page.path));
  for (const retired of publishedPaths) {
    if (!/^\/study\/(?:[a-z0-9-]+\/)*$/.test(retired)) throw new Error(`Invalid published topic path: ${retired}`);
    if (activePaths.has(retired)) continue;
    const parent = [...pages].reverse().find((page) => retired.startsWith(page.path)) ?? hub;
    const tombstone = readFileSync(resolve(lander, "404.html"), "utf8")
      .replace("Page not found | K53 Study Guide", "Study section moved | K53 Study Guide")
      .replace("That page could not be found.", "This study section has moved")
      .replace(
        "</h1>",
        `</h1><p class="guide-intro"><a href="${parent.path}">Continue with ${escapeHtml(parent.name)}</a>.</p>`,
      );
    const target = resolve(outputDir, `.${retired}`, "index.html");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, tombstone);
  }
  const originalSitemap = readFileSync(resolve(lander, "scripts/sitemap-base.xml"), "utf8");
  const added = preview
    ? ""
    : pages.map((page) => `  <url><loc>${host}${page.path}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n");
  mkdirSync(resolve(outputDir, "public"), { recursive: true });
  writeFileSync(resolve(outputDir, "public/sitemap.xml"), originalSitemap.replace("</urlset>", `${added}\n</urlset>`));
  return pages.map((page) => page.path);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const preview = process.env.TOPIC_PREVIEW !== "0";
  const paths = generateTopics({
    outputDir: lander,
    preview,
    appBase: process.env.TOPIC_APP_BASE ?? (preview ? "/app-preview/" : "/app/"),
    imageBase: process.env.TOPIC_IMAGE_BASE ?? (preview ? "/app-preview/assets/images" : "/app/assets/images"),
  });
  console.log(`Generated ${paths.length} study pages (${preview ? "noindex preview" : "production"}).`);
}
