import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";

export function checkLinks(root: string): string[] {
  const errors: string[] = [];
  function visit(directory: string) {
    for (const file of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, file.name);
      if (file.isDirectory()) {
        visit(path);
        continue;
      }
      if (extname(file.name) !== ".html") continue;
      const relative = path.slice(root.length).replaceAll("\\", "/");
      const base = `https://www.k53studyguide.online${relative.replace(/index\.html$/, "")}`;
      const dom = new JSDOM(readFileSync(path, "utf8"), { url: base });
      for (const element of dom.window.document.querySelectorAll("[href], [src]")) {
        const value = element.getAttribute("href") ?? element.getAttribute("src")!;
        const url = new URL(value, base);
        if (url.origin !== "https://www.k53studyguide.online" || /^\/app(?:-preview)?(?:\/|$)/.test(url.pathname))
          continue;
        let target = join(root, decodeURIComponent(url.pathname));
        if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
        if (!existsSync(target)) {
          errors.push(`${relative}: ${value} does not exist`);
          continue;
        }
        if (url.hash && extname(target) === ".html") {
          const targetDocument =
            target === path ? dom.window.document : new JSDOM(readFileSync(target, "utf8")).window.document;
          if (!targetDocument.getElementById(decodeURIComponent(url.hash.slice(1))))
            errors.push(`${relative}: ${value} has no anchor`);
        }
      }
      dom.window.close();
    }
  }
  visit(root);
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = checkLinks(resolve("dist"));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else console.log("Built HTML links and assets resolve.");
}
