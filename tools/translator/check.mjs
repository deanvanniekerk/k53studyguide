import { fileURLToPath } from "node:url";
import { loadSource, readOptional } from "./generator.mjs";
import { hash, validateTranslations } from "./validation.mjs";

const allSource = await loadSource(
  fileURLToPath(new URL("../../pkg/shared/src/data/translations.ts", import.meta.url)),
);
const source = Object.fromEntries(Object.entries(allSource).filter(([, text]) => text.trim()));
const complete = process.argv.includes("--complete");
let failed = false;
for (const target of ["af", "zu", "xh"]) {
  const path = fileURLToPath(new URL(`../../pkg/shared/src/data/locales/${target}.json`, import.meta.url));
  const raw = await readOptional(path);
  const resource = raw ? JSON.parse(raw) : { locale: target, entries: {} };
  if (resource.locale !== target || !resource.entries) throw new Error(`Invalid resource: ${path}`);
  const english = {};
  const translated = {};
  let stale = 0;
  for (const [key, entry] of Object.entries(resource.entries)) {
    if (!(key in source)) {
      console.error(`${target}: obsolete key ${key}`);
      failed = true;
      continue;
    }
    english[key] = source[key];
    translated[key] = entry.text;
    if (entry.sourceHash !== hash(source[key])) stale++;
  }
  try {
    validateTranslations(english, translated);
  } catch (error) {
    console.error(`${target}: ${error.message}`);
    failed = true;
  }
  const missing = Object.keys(source).length - Object.keys(english).length;
  console.log(
    `${target}: ${Object.keys(english).length}/${Object.keys(source).length} entries, missing=${missing}, stale=${stale}`,
  );
  if (complete && (missing || stale)) failed = true;
}
if (failed) process.exitCode = 1;
