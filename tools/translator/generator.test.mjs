import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, copyFile, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { generate } from "./generator.mjs";
import { parseOptions } from "./main.js";
import { hash } from "./validation.mjs";

async function fixture(run, mode = "valid") {
  const root = await mkdtemp(join(tmpdir(), "k53-translation-test-"));
  try {
    const sourcePath = join(root, "source.json");
    const outputPath = join(root, "af.json");
    const codex = join(root, "codex");
    await writeFile(sourcePath, JSON.stringify({ greeting: { en: "Hello" }, rule: { en: "Keep 5 m clear" } }));
    await writeFile(
      codex,
      `#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const args = process.argv.slice(2);
if (args.includes('status')) { console.log(${JSON.stringify(mode === "api" ? "Logged in using an API key" : "Logged in using ChatGPT")}); process.exit(0); }
if (args.includes('--help')) { console.log('--ignore-user-config --ignore-rules --output-schema --output-last-message'); process.exit(0); }
const prompt = JSON.parse(readFileSync(0, 'utf8').split('INPUT_JSON\\n')[1]);
const log = ${JSON.stringify(join(root, "calls.json"))};
const calls = existsSync(log) ? JSON.parse(readFileSync(log)) : [];
calls.push({args, env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY, OPENAI_BASE_URL: process.env.OPENAI_BASE_URL }, prompt});
writeFileSync(log, JSON.stringify(calls));
if (${JSON.stringify(mode)} === 'model') { console.error('model unavailable'); process.exit(1); }
if (${JSON.stringify(mode)} === 'source-change') writeFileSync(${JSON.stringify(sourcePath)}, JSON.stringify({ greeting: { en: 'Changed' }, rule: { en: 'Keep 5 m clear' } }));
if (${JSON.stringify(mode)} === 'cancel' && calls.length === 2) setTimeout(() => {}, 10000);
else if (${JSON.stringify(mode)} === 'retry' && calls.length === 1) writeFileSync(args[args.indexOf('--output-last-message')+1], '{bad');
else {
 const result = Object.fromEntries(Object.entries(prompt.entries).map(([key, en]) => [key, key === 'greeting' ? 'Hallo' : 'Hou 5 m oop']));
 if (${JSON.stringify(mode)} === 'partial' && prompt.entries.rule) delete result.rule;
 writeFileSync(args[args.indexOf('--output-last-message')+1], JSON.stringify(result));
}
`,
    );
    await chmod(codex, 0o755);
    await run(
      { target: "af", sourcePath, outputPath, codex, report: () => {}, activityMs: 20, retries: 1, retryDelayMs: 1 },
      root,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("generation maps subscription-only arguments, checkpoints validated work and skips unchanged reruns", async () => {
  await fixture(async (config, root) => {
    const result = await generate({
      ...config,
      environment: {
        ...process.env,
        OPENAI_API_KEY: "must-not-reach-codex",
        OPENAI_BASE_URL: "https://example.invalid",
      },
    });
    assert.equal(result.translated, 2);
    const before = await readFile(config.outputPath, "utf8");
    assert.equal(JSON.parse(before).entries.greeting.text, "Hallo");
    const calls = JSON.parse(await readFile(join(root, "calls.json")));
    assert.equal(calls.length, 1);
    assert.ok(calls[0].args.includes("--ignore-user-config"));
    assert.ok(calls[0].args.includes('forced_login_method="chatgpt"'));
    assert.ok(calls[0].args.includes('model_provider="openai"'));
    assert.ok(calls[0].args.includes('model_reasoning_effort="medium"'));
    assert.equal(calls[0].args[calls[0].args.indexOf("--model") + 1], "gpt-6.1-sol");
    assert.equal(calls[0].args[calls[0].args.indexOf("--sandbox") + 1], "read-only");
    assert.deepEqual(calls[0].env, {});
    const rerun = await generate({ ...config, codex: "unavailable-codex", resume: true });
    assert.equal(rerun.skipped, 2);
    assert.equal(await readFile(config.outputPath, "utf8"), before);
  });
});

test("dry run reports work without invoking Codex or changing files", async () => {
  const root = await mkdtemp(join(tmpdir(), "k53-translation-test-"));
  try {
    const sourcePath = join(root, "source.json");
    await writeFile(sourcePath, JSON.stringify({ greeting: { en: "Hello" }, rule: { en: "Keep 5 m clear" } }));
    const lines = [];
    const result = await generate({
      target: "af",
      dryRun: true,
      sourcePath,
      outputPath: join(root, "af.json"),
      codex: "unavailable-codex",
      report: (line) => lines.push(line),
    });
    assert.equal(result.pending, 2);
    assert.equal(result.translated, 0);
    assert.match(lines.join("\n"), /af.*gpt-6.1-sol.*medium/);
    assert.match(lines.join("\n"), /requiring generation=2.*skipped=0/);
    await assert.rejects(readFile(join(root, "af.json")), { code: "ENOENT" });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("retries malformed output, reports real progress and visible waiting activity when redirected", async () => {
  await fixture(async (config, root) => {
    const lines = [];
    const result = await generate({ ...config, report: (line) => lines.push(line) });
    assert.equal(result.translated, 2);
    assert.equal(JSON.parse(await readFile(join(root, "calls.json"))).length, 2);
    assert.match(lines.join("\n"), /Retry 1\/1/);
    assert.match(lines.join("\n"), /Waiting.*elapsed/);
    assert.match(lines.join("\n"), /processed=2\/2.*100%.*translated=2.*failed=0/);
    assert.match(lines.join("\n"), /Summary.*duration=.*output=/);
  }, "retry");
});

test("keeps successful batches on partial failure and resumes only unfinished work", async () => {
  await fixture(async (config, root) => {
    const lines = [];
    const result = await generate({ ...config, batchSize: 1, report: (line) => lines.push(line) });
    assert.equal(result.translated, 1);
    assert.equal(result.failed, 1);
    const resource = JSON.parse(await readFile(config.outputPath));
    assert.equal(resource.entries.greeting.text, "Hallo");
    assert.equal(resource.entries.rule, undefined);
    assert.match(lines.join("\n"), /Resume.*--resume/);
    const rerun = await generate({ ...config, batchSize: 1, resume: true });
    assert.equal(rerun.skipped, 1);
    const calls = JSON.parse(await readFile(join(root, "calls.json")));
    assert.ok(calls.slice(3).every((call) => !call.prompt.entries.greeting));
  }, "partial");
});

test("rejects source changes during generation without writing returned text", async () => {
  await fixture(async (config) => {
    await assert.rejects(generate(config), /English source changed/);
    await assert.rejects(readFile(config.outputPath), { code: "ENOENT" });
  }, "source-change");
});

test("preserves manual corrections, flags stale manual text and regenerates stale AI text", async () => {
  await fixture(async (config) => {
    await generate(config);
    const resource = JSON.parse(await readFile(config.outputPath));
    resource.entries.greeting.text = "Goeiedag";
    await writeFile(config.outputPath, JSON.stringify(resource));
    await writeFile(
      config.sourcePath,
      JSON.stringify({ greeting: { en: "Welcome" }, rule: { en: "Leave 5 m clear" } }),
    );
    const result = await generate({ ...config, regenerateAI: true });
    assert.equal(result.reviewRequired, 1);
    assert.equal(result.translated, 1);
    assert.equal(JSON.parse(await readFile(config.outputPath)).entries.greeting.text, "Goeiedag");
  });
});

test("rejects API authentication and unavailable models without switching transport", async () => {
  for (const mode of ["api", "model"])
    await fixture(async (config, root) => {
      await assert.rejects(
        generate(config),
        mode === "api" ? /ChatGPT subscription authentication/ : /model unavailable/,
      );
      await assert.rejects(readFile(config.outputPath), { code: "ENOENT" });
      if (mode === "model") assert.equal(JSON.parse(await readFile(join(root, "calls.json"))).length, 1);
    }, mode);
});

test("cancellation preserves completed work and reports the resume command", async () => {
  await fixture(async (config) => {
    const controller = new AbortController();
    const lines = [];
    const report = (line) => {
      lines.push(line);
      if (/batch=2/.test(line)) setTimeout(() => controller.abort(), 70);
    };
    await assert.rejects(generate({ ...config, signal: controller.signal, batchSize: 1, report }), /cancelled/);
    const resource = JSON.parse(await readFile(config.outputPath));
    assert.equal(resource.entries.greeting.text, "Hallo");
    assert.equal(resource.entries.rule, undefined);
    assert.match(lines.join("\n"), /Summary.*translated=1/);
    assert.match(lines.join("\n"), /Resume.*--resume/);
  }, "cancel");
});

test("CLI accepts documented model/effort/target flags and rejects unsupported effort values", () => {
  const options = parseOptions([
    "--",
    "--target",
    "xh",
    "--model",
    "gpt-6-astra",
    "--reasoning-effort",
    "low",
    "--sample",
    "--resume",
  ]);
  assert.equal(options.target, "xh");
  assert.equal(options.model, "gpt-6-astra");
  assert.equal(options.reasoningEffort, "low");
  assert.equal(options.resume, true);
  assert.match(options.outputPath, /translation-samples.*xh-gpt-6-astra-low\.json$/);
  assert.throws(() => parseOptions(["--target", "af", "--reasoning-effort", "impossible"]), /reasoning effort/);
  assert.throws(() => parseOptions(["--target", "../af"]), /target/);
  assert.equal(parseOptions(["--target", "af", "--limit", "50"]).limit, 50);
  assert.equal(parseOptions(["--target", "af", "--all"]).all, true);
  assert.throws(() => parseOptions(["--target", "af", "--limit", "50", "--all"]), /not both/);
  for (const value of ["0", "-1", "2.5", "NaN", "", "Infinity", "9007199254740992"])
    assert.throws(() => parseOptions(["--target", "af", `--limit=${value}`]), /positive whole number/);
});

test("limited chunks skip completed records on resume and keep question groups intact", async () => {
  await fixture(async (config, root) => {
    await writeFile(
      config.sourcePath,
      JSON.stringify({
        greeting: { en: "Hello" },
        rule: { en: "Keep 5 m clear" },
        "section.question.1.text": { en: "Keep 5 m clear" },
        "section.question.1.a": { en: "Keep 5 m clear" },
        "section.question.1.b": { en: "Keep 5 m clear" },
        final: { en: "Keep 5 m clear" },
      }),
    );
    const first = await generate({
      ...config,
      requestLimit: async (remaining) => {
        assert.equal(remaining, 6);
        return 3;
      },
    });
    assert.equal(first.translated, 2);
    assert.equal(first.pending, 4);
    assert.equal(first.deferred, 4);
    const second = await generate({ ...config, limit: 3, resume: true });
    assert.equal(second.translated, 3);
    assert.equal(second.skipped, 2);
    assert.equal(second.pending, 1);
    assert.equal(second.deferred, 1);
    const calls = JSON.parse(await readFile(join(root, "calls.json")));
    assert.deepEqual(Object.keys(calls[1].prompt.entries), [
      "section.question.1.text",
      "section.question.1.a",
      "section.question.1.b",
    ]);
    const final = await generate({ ...config, requestLimit: async () => undefined, resume: true });
    assert.equal(final.translated, 1);
    assert.equal(final.pending, 0);
    assert.equal(final.deferred, 0);
  });
});

test("a limited chunk can fail without losing its checkpoint and later resume unfinished entries", async () => {
  await fixture(async (config, root) => {
    const first = await generate({ ...config, limit: 1 });
    assert.equal(first.translated, 1);
    assert.equal(first.deferred, 1);
    const before = await readFile(config.outputPath, "utf8");
    const second = await generate({ ...config, limit: 1, resume: true });
    assert.equal(second.skipped, 1);
    assert.equal(second.failed, 1);
    assert.equal(second.pending, 1);
    assert.equal(second.deferred, 0);
    assert.equal(await readFile(config.outputPath, "utf8"), before);
    const calls = JSON.parse(await readFile(join(root, "calls.json")));
    assert.ok(calls.slice(1).every((call) => Object.keys(call.prompt.entries).join() === "rule"));
  }, "partial");
});

test("CLI chunk exits successfully with work remaining and resumes the next chunk", async () => {
  await fixture(async (_config, root) => {
    const toolPath = join(root, "tools/translator");
    const dataPath = join(root, "pkg/shared/src/data");
    await mkdir(toolPath, { recursive: true });
    await mkdir(dataPath, { recursive: true });
    for (const name of ["main.js", "generator.mjs", "codex.mjs", "validation.mjs", "defaults.json"])
      await copyFile(new URL(name, import.meta.url), join(toolPath, name));
    await writeFile(join(toolPath, "package.json"), '{"type":"module"}');
    await writeFile(
      join(dataPath, "translations.ts"),
      'export const translations = {greeting:{en:"Hello"},rule:{en:"Keep 5 m clear"}};',
    );
    await writeFile(join(dataPath, "questions.ts"), "export const questionData = {};");
    const mainPath = await realpath(join(toolPath, "main.js"));
    const run = (args) =>
      spawnSync(process.execPath, [mainPath, "--target", "af", ...args], {
        encoding: "utf8",
        env: { ...process.env, PATH: `${root}:${process.env.PATH}`, CI: "" },
        timeout: 10000,
      });
    const first = run(["--limit", "1"]);
    assert.equal(first.status, 0, first.stderr);
    assert.match(first.stderr, /Chunk complete; 1 records remain/);
    const second = run(["--resume", "--limit", "1"]);
    assert.equal(second.status, 0, second.stderr);
    assert.match(second.stderr, /translated=1 skipped=1.*pending=0/);
    assert.equal(Object.keys(JSON.parse(await readFile(join(dataPath, "locales/af.json"))).entries).length, 2);
  });
});

test("invalid regeneration leaves all previous valid resources byte-for-byte intact", async () => {
  await fixture(async (config) => {
    const entries = Object.fromEntries(
      [
        ["greeting", "Hello", "Hallo"],
        ["rule", "Keep 5 m clear", "Hou 5 m oop"],
      ].map(([key, english, text]) => [
        key,
        { text, sourceHash: hash(english), generatedHash: hash(text), promptVersion: "k53-v1" },
      ]),
    );
    const before = JSON.stringify({ locale: "af", entries });
    await writeFile(config.outputPath, before);
    const result = await generate({ ...config, regenerateAI: true });
    assert.equal(result.failed, 2);
    assert.equal(result.translated, 0);
    assert.equal(await readFile(config.outputPath, "utf8"), before);
  }, "partial");
});
