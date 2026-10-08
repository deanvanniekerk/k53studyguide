import { mkdir, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { preflight, translateBatch, withCodexWorkspace } from "./codex.mjs";
import defaults from "./defaults.json" with { type: "json" };
import { hash, validateTranslations } from "./validation.mjs";

export async function loadSource(sourcePath) {
  const data = sourcePath.endsWith(".json")
    ? JSON.parse(await readFile(sourcePath, "utf8"))
    : (await import(`${pathToFileURL(sourcePath)}?v=${Date.now()}`)).translations;
  const entries = Object.entries(data).map(([key, value]) => [key, value.en]);
  if (entries.some(([, value]) => typeof value !== "string")) throw new Error("English source must contain strings");
  return Object.fromEntries(entries);
}

export async function readOptional(path) {
  try { return await readFile(path, "utf8"); }
  catch (error) { if (error.code !== "ENOENT") throw error; return null; }
}

const questionGroup = (key) => key.match(/^(.*\.question\.\d+)\./)?.[1] ?? key;

function batches(pending, source, config) {
  const groups = new Map();
  for (const key of pending) {
    const group = questionGroup(key);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(key);
  }
  const result = [];
  let batch = [];
  let characters = 0;
  for (const keys of groups.values()) {
    const group = questionGroup(keys[0]);
    const contextKeys = Object.keys(source).filter((key) => questionGroup(key) === group);
    const size = contextKeys.reduce((sum, key) => sum + key.length + source[key].length, 0);
    if (size > config.maxBatchCharacters) throw new Error(`Group ${group} exceeds maxBatchCharacters; increase the explicit batch limit.`);
    if (batch.length && (batch.length + keys.length > config.batchSize || characters + size > config.maxBatchCharacters)) {
      result.push(batch); batch = []; characters = 0;
    }
    batch.push(...keys); characters += size;
  }
  if (batch.length) result.push(batch);
  return result;
}

export function sampleKeys(source) {
  const keys = Object.keys(source);
  const chosen = new Set(keys.slice(0, 5));
  const representative = [
    keys.find((key) => /signs/.test(key)), keys.find((key) => /controls/i.test(key)),
    keys.find((key) => /\{[^}]+\}/.test(source[key])),
    keys.find((key) => /\d.*(?:km\/h|kg|mm)/.test(source[key])),
    keys.find((key) => /\b(?:not|never|except)\b/i.test(source[key])),
    keys.reduce((longest, key) => source[key].length > (source[longest]?.length ?? 0) ? key : longest, ""),
    keys.find((key) => /\.question\.\d+\./.test(key)),
  ].filter(Boolean);
  for (const key of representative) {
    for (const related of keys.filter((candidate) => questionGroup(candidate) === questionGroup(key))) chosen.add(related);
  }
  return keys.filter((key) => chosen.has(key));
}

export async function generate(options) {
  const config = { ...defaults, codex: "codex", retryDelayMs: 1000, ...options };
  const report = config.report ?? console.error;
  const started = Date.now();
  const source = await loadSource(config.sourcePath);
  const questionContext = config.questionsPath
    ? (await import(`${pathToFileURL(config.questionsPath)}?v=${Date.now()}`)).questionData
    : {};
  let previous = await readOptional(config.outputPath);
  const resource = previous ? JSON.parse(previous) : { locale: config.target, entries: {} };
  if (resource.locale !== config.target || !resource.entries || typeof resource.entries !== "object" || Array.isArray(resource.entries)) throw new Error("Invalid locale resource");
  const selected = config.sample ? sampleKeys(source) : Object.keys(source);
  const manual = selected.filter((key) => {
    const entry = resource.entries[key];
    return entry && (!entry.generatedHash || hash(entry.text) !== entry.generatedHash);
  });
  const staleManual = manual.filter((key) => resource.entries[key].sourceHash !== hash(source[key]));
  // Whitespace-only fields intentionally suppress some headings/descriptions.
  // They need no model translation and always fall back to the English value.
  const pending = selected.filter((key) => source[key].trim() && !manual.includes(key)
    && (config.regenerateAI || resource.entries[key]?.sourceHash !== hash(source[key])
      || resource.entries[key]?.promptVersion !== config.promptVersion));
  const total = selected.length;
  const counts = { pending: pending.length, translated: 0, skipped: total - pending.length, failed: 0, reviewRequired: staleManual.length };
  const summary = () => {
    report(`Summary ${config.target}: translated=${counts.translated} skipped=${counts.skipped} failed=${counts.failed} pending=${counts.pending} manual-review=${counts.reviewRequired} duration=${((Date.now() - started) / 1000).toFixed(1)}s output=${config.outputPath}`);
    if (counts.pending && !config.dryRun) report(`Resume: pnpm translations:generate -- --target ${config.target} --model ${config.model} --reasoning-effort ${config.reasoningEffort}${config.sample ? " --sample" : ""} --resume`);
  };
  report(`${config.target} model=${config.model} effort=${config.reasoningEffort}: total=${total} requiring generation=${pending.length} skipped=${counts.skipped}`);
  for (const key of staleManual) report(`Manual correction preserved; English changed, review required: ${key}`);
  if (config.dryRun || !pending.length) { summary(); return counts; }
  await mkdir(dirname(config.outputPath), { recursive: true });
  const lockPath = `${config.outputPath}.lock`;
  const lock = await open(lockPath, "wx").catch((error) => { throw new Error(`Cannot lock ${config.outputPath}: ${error.message}. Another generator may be running.`); });
  try {
    await withCodexWorkspace(async (cwd) => {
      report("Checking Codex CLI and ChatGPT subscription login...");
      await preflight(config, cwd);
      const work = batches(pending, source, config);
      for (const [index, keys] of work.entries()) {
        if (config.signal?.aborted) throw new Error("Translation generation cancelled");
        const groups = new Set(keys.map(questionGroup));
        const relatedText = Object.fromEntries(Object.entries(source).filter(([key]) => groups.has(questionGroup(key)) && !keys.includes(key)));
        const questions = Object.values(questionContext).flat().filter((question) => question.option.some((option) => groups.has(questionGroup(option.value))));
        const context = { relatedText, questions };
        const entries = Object.fromEntries(keys.map((key) => [key, source[key]]));
        const progress = () => {
          const processed = counts.skipped + counts.translated + counts.failed;
          report(`${config.target} batch=${index + 1}/${work.length} processed=${processed}/${total} ${Math.round(processed / total * 100)}% translated=${counts.translated} skipped=${counts.skipped} failed=${counts.failed}`);
        };
        progress();
        let result;
        let lastError = "";
        for (let attempt = 0; attempt <= config.retries; attempt++) {
          const batchStarted = Date.now();
          const activity = setInterval(() => report(`Waiting ${config.target} batch=${index + 1} elapsed=${((Date.now() - batchStarted) / 1000).toFixed(1)}s (validated=${counts.translated})`), config.activityMs);
          try {
            result = await translateBatch(config, cwd, entries, context, lastError);
            validateTranslations(entries, result);
            break;
          } catch (error) {
            result = undefined;
            if (config.signal?.aborted || /model.*(?:unavailable|not supported|not found)|reasoning.*(?:unsupported|not supported)|usage limit|rate.?limit|429|authentication|API key|not logged in/i.test(error.message)) throw error;
            lastError = error.message;
            report(`Validation/request failure ${config.target}: ${lastError}`);
            if (attempt < config.retries) {
              report(`Retry ${attempt + 1}/${config.retries} ${config.target}; completed translations remain checkpointed.`);
              await new Promise((resolve) => setTimeout(resolve, config.retryDelayMs * (attempt + 1)));
            }
          } finally { clearInterval(activity); }
        }
        if (!result) { counts.failed += keys.length; progress(); continue; }
        if (JSON.stringify(await loadSource(config.sourcePath)) !== JSON.stringify(source)) throw new Error("English source changed during generation; returned results were not applied. Resume with the current source.");
        if (await readOptional(config.outputPath) !== previous) throw new Error("Locale file changed during generation; edits preserved, returned results were not applied.");
        for (const key of keys) resource.entries[key] = { text: result[key], sourceHash: hash(source[key]), generatedHash: hash(result[key]),
          model: config.model, reasoningEffort: config.reasoningEffort, promptVersion: config.promptVersion };
        resource.entries = Object.fromEntries(Object.entries(resource.entries).sort(([a], [b]) => a.localeCompare(b, "en")));
        await atomicWrite(config.outputPath, resource);
        previous = await readOptional(config.outputPath);
        counts.translated += keys.length;
        counts.pending -= keys.length;
        progress();
        report(`Checkpoint: ${config.outputPath}; --resume skips completed unchanged entries.`);
      }
    });
    return counts;
  } finally {
    await lock.close();
    await rm(lockPath, { force: true });
    summary();
  }
}

export async function atomicWrite(path, data) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`);
    await rename(temporary, path);
  } finally { await rm(temporary, { force: true }); }
}
