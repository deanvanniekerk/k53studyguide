// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, expect, test } from "vitest";

const scratch: string[] = [];
const script = resolve("../../scripts/deploy-lander-ftp.sh");
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "k53-deploy-")); scratch.push(root);
  mkdirSync(join(root, "bin"));
  for (const path of ["index.html", "privacy.html", "sitemap.xml", "robots.txt", "404.html", ".htaccess", "assets/site.css", "study/index.html", "study/topic/index.html"]) {
    const target = join(root, "pkg/lander/dist", path); mkdirSync(resolve(target, ".."), { recursive: true }); writeFileSync(target, path);
  }
  writeFileSync(join(root, "bin/pnpm"), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  writeFileSync(join(root, "bin/curl"), `#!/bin/sh
case "$*" in
  *--upload-file*) printf "%s\\n" "$*" >> "$DEPLOY_LOG" ;;
  *)
    output=""
    while [ "$#" -gt 0 ]; do
      if [ "$1" = "--output" ]; then shift; output="$1"; fi
      shift
    done
    if [ -n "$EXISTING_RULES" ]; then cp "$EXISTING_RULES" "$output"; else exit 78; fi ;;
esac
`, { mode: 0o755 });
  const env = { ...process.env, PATH: `${root}/bin:${process.env.PATH}`, FTP_PASSWORD: "fixture", DEPLOY_LOG: join(root, "uploads") };
  delete env.WEB_LAUNCH_APPROVED;
  return { root, env };
}
afterEach(() => { for (const dir of scratch.splice(0)) rmSync(dir, { recursive: true, force: true }); });

test("routine website deployment stops before uploading without the owner launch gate", () => {
  const { root, env } = fixture();
  const result = spawnSync("bash", [script], { cwd: root, env, encoding: "utf8" });
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain("owner");
  expect(() => readFileSync(join(root, "uploads"))).toThrow();
});


test("preview publishing uploads additive topic files without changing live entry points", () => {
  const { root, env } = fixture();
  const result = spawnSync("bash", [script, "--preview-topics"], { cwd: root, env, encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
  const uploads = readFileSync(join(root, "uploads"), "utf8").trim().split("\n").map(line => line.split(" ").at(-1));
  expect(uploads).toEqual([
    "ftp://ftp.k53studyguide.online/./assets/site.css",
    "ftp://ftp.k53studyguide.online/./404.html",
    "ftp://ftp.k53studyguide.online/./.htaccess",
    "ftp://ftp.k53studyguide.online/./robots.txt",
    "ftp://ftp.k53studyguide.online/./study/404.html",
    "ftp://ftp.k53studyguide.online/./study/.htaccess",
    expect.stringMatching(/\/study\/(?:topic\/)?index.html$/),
    expect.stringMatching(/\/study\/(?:topic\/)?index.html$/),
  ]);
});

test("approved production publishing requires production topics and uploads the homepage last", () => {
  const { root, env } = fixture();
  const withoutProductionTopics = spawnSync("bash", [script], { cwd: root, env: { ...env, WEB_LAUNCH_APPROVED: "1", TOPIC_PREVIEW: "1" }, encoding: "utf8" });
  expect(withoutProductionTopics.status).not.toBe(0);
  const result = spawnSync("bash", [script], { cwd: root, env: { ...env, WEB_LAUNCH_APPROVED: "1", TOPIC_PREVIEW: "0" }, encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
  const uploads = readFileSync(join(root, "uploads"), "utf8").trim().split("\n");
  expect(uploads.at(-1)).toContain("/./index.html");
  expect(uploads.some(line => line.includes("/./privacy.html"))).toBe(true);
});


test("preview publishing stops before any upload when host rules would be replaced", () => {
  const { root, env } = fixture();
  const existing = join(root, "existing.htaccess");
  writeFileSync(existing, "RewriteEngine On\n# owner canonical redirects\n");
  const result = spawnSync("bash", [script, "--preview-topics"], { cwd: root, env: { ...env, EXISTING_RULES: existing }, encoding: "utf8" });
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain("existing root .htaccess");
  expect(() => readFileSync(join(root, "uploads"))).toThrow();
});


test.each([false, true])("publishes matching root rules or an intentional update against a captured baseline (update=%s)", (update) => {
  const { root, env } = fixture();
  const existing = join(root, "captured.htaccess");
  writeFileSync(existing, ".htaccess");
  if (update) writeFileSync(join(root, "pkg/lander/dist/.htaccess"), "ErrorDocument 404 /404.html\n# reviewed new rule\n");
  const result = spawnSync("bash", [script, "--preview-topics"], { cwd: root, env: { ...env, EXISTING_RULES: existing, ...(update ? { FTP_EXPECTED_ROOT_RULES: existing } : {}) }, encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
  expect(readFileSync(join(root, "uploads"), "utf8")).toContain("/./.htaccess");
});
