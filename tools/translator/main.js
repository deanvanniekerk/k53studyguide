import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import defaults from "./defaults.json" with { type: "json" };
import { generate } from "./generator.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const help = `Manually generate offline translations using your signed-in Codex subscription.

pnpm translations:generate -- --target af [options]

  --target LOCALE           Target language (first release: af, zu, xh)
  --model MODEL             Default: ${defaults.model}; unavailable models fail
  --reasoning-effort EFFORT Default: ${defaults.reasoningEffort}; unsupported efforts fail
  --dry-run                 Show missing/stale/manual entries without model calls
  --sample                  Use a fixed representative sample in .translation-samples/
  --resume                  Continue from validated checkpoints (also the default)
  --regenerate-ai           Explicitly regenerate unchanged AI entries too
  --help                    Show this help

Requires Codex CLI with --ignore-user-config and ChatGPT login. No API keys.
Sequential bounded batches. Ctrl-C preserves validated work. Never run from CI,
app startup, install, build, deployment, automation or a background job.
Review generated text with fluent speakers before shipping. Samples never ship.
`;

export function parseOptions(args) {
  const { values } = parseArgs({
    args: args.filter((arg) => arg !== "--"),
    options: {
      target: { type: "string" },
      model: { type: "string" },
      "reasoning-effort": { type: "string" },
      "dry-run": { type: "boolean" },
      sample: { type: "boolean" },
      resume: { type: "boolean" },
      "regenerate-ai": { type: "boolean" },
      help: { type: "boolean" },
    },
  });
  if (values.help) return { help: true };
  if (!values.target || values.target === "en" || !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(values.target))
    throw new Error("Pass --target af, zu or xh (other valid locale codes may be generated for future review).");
  if (
    values["reasoning-effort"] &&
    !["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"].includes(values["reasoning-effort"])
  )
    throw new Error("Invalid reasoning effort; use an effort supported by the selected model.");
  const options = {
    target: values.target,
    dryRun: values["dry-run"],
    sample: values.sample,
    resume: values.resume,
    regenerateAI: values["regenerate-ai"],
    sourcePath: resolve(root, "pkg/shared/src/data/translations.ts"),
    questionsPath: resolve(root, "pkg/shared/src/data/questions.ts"),
  };
  if (values.model) options.model = values.model;
  if (values["reasoning-effort"]) options.reasoningEffort = values["reasoning-effort"];
  const sampleName =
    `${values.target}-${values.model ?? defaults.model}-${values["reasoning-effort"] ?? defaults.reasoningEffort}`.replace(
      /[^a-zA-Z0-9-]/g,
      "_",
    );
  options.outputPath = values.sample
    ? resolve(root, `.translation-samples/${sampleName}.json`)
    : resolve(root, `pkg/shared/src/data/locales/${values.target}.json`);
  return options;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  process.on("SIGINT", cancel);
  process.on("SIGTERM", cancel);
  try {
    const options = parseOptions(process.argv.slice(2));
    if (options.help) console.log(help);
    else {
      if (process.env.CI && !options.dryRun)
        throw new Error("Generation is manual and local only; it cannot run in CI.");
      const result = await generate({ ...options, signal: controller.signal });
      if (result.failed || result.reviewRequired || (!options.dryRun && result.pending)) process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = controller.signal.aborted ? 130 : 1;
  } finally {
    process.removeListener("SIGINT", cancel);
    process.removeListener("SIGTERM", cancel);
  }
}
