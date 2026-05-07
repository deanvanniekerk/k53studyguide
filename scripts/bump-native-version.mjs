#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const files = {
  androidGradle: resolve(repoRoot, "pkg/app/android/app/build.gradle"),
  iosProject: resolve(repoRoot, "pkg/app/ios/App/App.xcodeproj/project.pbxproj"),
};

const usage = `Usage:
  pnpm bump:native
  pnpm bump:native -- --version 1.27 --build 27
  pnpm bump:native -- --android-version 1.27 --android-code 27 --ios-version 1.5 --ios-build 28

Options:
  --version <version>          Set both Android versionName and iOS MARKETING_VERSION.
  --build <number>            Set Android versionCode and iOS CURRENT_PROJECT_VERSION.
  --android-version <version>  Set only Android versionName.
  --android-code <number>      Set only Android versionCode.
  --ios-version <version>      Set only iOS MARKETING_VERSION.
  --ios-build <number>         Set only iOS CURRENT_PROJECT_VERSION.
  --help                       Show this help text.

Without options, version strings bump their last numeric segment and build numbers increment by 1.`;

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") {
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const key = arg.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function readText(path) {
  return readFileSync(path, "utf8");
}

function writeText(path, text) {
  writeFileSync(path, text);
}

function getRequiredMatch(text, pattern, label) {
  const match = text.match(pattern);

  if (!match) {
    throw new Error(`Could not find ${label}`);
  }

  return match[1];
}

function incrementInteger(value, label) {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${label} must be an integer, got "${value}"`);
  }

  return String(Number(value) + 1);
}

function incrementVersion(value, label) {
  const parts = value.split(".");

  if (!parts.every((part) => /^\d+$/.test(part))) {
    throw new Error(`${label} must use numeric dot-separated segments, got "${value}"`);
  }

  parts[parts.length - 1] = String(Number(parts[parts.length - 1]) + 1);
  return parts.join(".");
}

function validateVersion(value, label) {
  if (!/^\d+(?:\.\d+)*$/.test(value)) {
    throw new Error(`${label} must use numeric dot-separated segments, got "${value}"`);
  }
}

function validateInteger(value, label) {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${label} must be an integer, got "${value}"`);
  }
}

function replaceRequired(text, pattern, replacement, label) {
  let replaced = false;

  const nextText = text.replace(pattern, (...args) => {
    replaced = true;
    return typeof replacement === "function" ? replacement(...args) : replacement;
  });

  if (!replaced) {
    throw new Error(`Could not update ${label}`);
  }

  return nextText;
}

function replaceAllRequired(text, pattern, replacement, label) {
  const matches = text.match(pattern);

  if (!matches) {
    throw new Error(`Could not update ${label}`);
  }

  return text.replace(pattern, replacement);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(usage);
    return;
  }

  const androidGradle = readText(files.androidGradle);
  const iosProject = readText(files.iosProject);

  const current = {
    androidVersion: getRequiredMatch(androidGradle, /\bversionName\s+"([^"]+)"/, "Android versionName"),
    androidCode: getRequiredMatch(androidGradle, /\bversionCode\s+(\d+)/, "Android versionCode"),
    iosVersion: getRequiredMatch(iosProject, /\bMARKETING_VERSION = ([^;]+);/, "iOS MARKETING_VERSION"),
    iosBuild: getRequiredMatch(iosProject, /\bCURRENT_PROJECT_VERSION = ([^;]+);/, "iOS CURRENT_PROJECT_VERSION"),
  };

  const next = {
    androidVersion: args["android-version"] ?? args.version ?? incrementVersion(current.androidVersion, "Android versionName"),
    androidCode: args["android-code"] ?? args.build ?? incrementInteger(current.androidCode, "Android versionCode"),
    iosVersion: args["ios-version"] ?? args.version ?? incrementVersion(current.iosVersion, "iOS MARKETING_VERSION"),
    iosBuild: args["ios-build"] ?? args.build ?? incrementVersion(current.iosBuild, "iOS CURRENT_PROJECT_VERSION"),
  };

  validateVersion(next.androidVersion, "Android versionName");
  validateInteger(next.androidCode, "Android versionCode");
  validateVersion(next.iosVersion, "iOS MARKETING_VERSION");
  validateVersion(next.iosBuild, "iOS CURRENT_PROJECT_VERSION");

  const nextAndroidGradle = replaceRequired(
    replaceRequired(androidGradle, /\bversionCode\s+\d+/, `versionCode ${next.androidCode}`, "Android versionCode"),
    /\bversionName\s+"[^"]+"/,
    `versionName "${next.androidVersion}"`,
    "Android versionName",
  );

  const nextIosProject = replaceAllRequired(
    replaceAllRequired(
      iosProject,
      /\bCURRENT_PROJECT_VERSION = [^;]+;/g,
      `CURRENT_PROJECT_VERSION = ${next.iosBuild};`,
      "iOS CURRENT_PROJECT_VERSION",
    ),
    /\bMARKETING_VERSION = [^;]+;/g,
    `MARKETING_VERSION = ${next.iosVersion};`,
    "iOS MARKETING_VERSION",
  );

  writeText(files.androidGradle, nextAndroidGradle);
  writeText(files.iosProject, nextIosProject);

  console.log("Native versions updated:");
  console.log(`  Android: ${current.androidVersion} (${current.androidCode}) -> ${next.androidVersion} (${next.androidCode})`);
  console.log(`  iOS:     ${current.iosVersion} (${current.iosBuild}) -> ${next.iosVersion} (${next.iosBuild})`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error("");
  console.error(usage);
  process.exit(1);
}
