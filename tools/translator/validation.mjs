import { createHash } from "node:crypto";

export const hash = (text) => createHash("sha256").update(text).digest("hex");
const sortedMatches = (text, pattern) => [...text.matchAll(pattern)].map((match) => match[0]).sort();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const units = (text) => sortedMatches(text, /(?<!\p{L})(?:km\/h|km|mm|cm|m|kg|kPa|cc|ml|litres?)\b|%|°C/gu);

// Keep the markup byte-for-byte. This includes attributes, URLs and image paths.
function markup(text) {
  const tags = text.match(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>/g) ?? [];
  const remaining = text.replace(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>/g, "");
  if (/<[a-zA-Z/!]/.test(remaining)) throw new Error("Malformed HTML");
  return tags;
}

export function validateTranslations(source, result) {
  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result) ||
    !same(Object.keys(source).sort(), Object.keys(result).sort())
  ) {
    throw new Error("Expected exactly the requested translation keys");
  }
  for (const [key, english] of Object.entries(source)) {
    const value = result[key];
    if (typeof value !== "string" || !value.trim()) throw new Error(`${key}: expected nonempty text`);
    const invariants = [
      ["placeholders", sortedMatches(english, /\{[^{}]+\}/g), sortedMatches(value, /\{[^{}]+\}/g)],
      ["HTML structure/attributes", markup(english), markup(value)],
      [
        "entities",
        sortedMatches(english, /&(?:#\d+|#x[\da-fA-F]+|[a-zA-Z]+);/g),
        sortedMatches(value, /&(?:#\d+|#x[\da-fA-F]+|[a-zA-Z]+);/g),
      ],
      ["numbers", sortedMatches(english, /\d+(?:[.,]\d+)*/g), sortedMatches(value, /\d+(?:[.,]\d+)*/g)],
      ["units", units(english), units(value)],
      [
        "brands",
        sortedMatches(english, /K53 Study Guide|K53|Google Play|App Store|Apple|Android|iOS|RevenueCat/g),
        sortedMatches(value, /K53 Study Guide|K53|Google Play|App Store|Apple|Android|iOS|RevenueCat/g),
      ],
    ];
    for (const [name, expected, actual] of invariants) {
      if (!same(expected, actual)) throw new Error(`${key}: changed protected ${name}`);
    }
  }
}
