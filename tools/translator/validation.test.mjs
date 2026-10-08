import assert from "node:assert/strict";
import test from "node:test";
import { validateTranslations } from "./validation.mjs";

test("accepts translated text while retaining placeholders, HTML, units and numbers", () => {
  assert.doesNotThrow(() =>
    validateTranslations(
      { rule: '<p class="rule">Keep {count} vehicles 5 m apart.</p>' },
      { rule: '<p class="rule">Hou {count} voertuie 5 m uitmekaar.</p>' },
    ),
  );
});

test("rejects incomplete or unsafe output without accepting a partial dictionary", () => {
  const source = { rule: '<p class="rule">Keep {count} vehicles 5 m apart.</p>', brand: "K53 Study Guide" };
  for (const result of [
    null,
    [],
    {},
    { ...source, extra: "Extra" },
    { rule: "", brand: "K53 Study Guide" },
    { rule: '<p class="rule">Hou 5 m uitmekaar.</p>', brand: "K53 Study Guide" },
    { rule: '<p onclick="alert(1)">Hou {count} voertuie 5 m uitmekaar.</p>', brand: "K53 Study Guide" },
    { rule: '<p class="rule">Hou {count} voertuie 6 m uitmekaar.</p>', brand: "K53 Study Guide" },
    { rule: '<p class="rule">Hou {count} voertuie 5 km uitmekaar.</p>', brand: "K53 Study Guide" },
    { rule: '<p class="rule">Hou {count} voertuie 5 m uitmekaar.</p><script', brand: "K53 Study Guide" },
    { rule: source.rule, brand: "Another brand" },
  ])
    assert.throws(() => validateTranslations(source, result));
});

test("protects units attached directly to numeric limits", () => {
  for (const [english, translated] of [
    ["Do not exceed 60km/h.", "Moenie 60mph oorskry nie."],
    ["Keep 14m clear.", "Hou 14kg oop."],
    ["Maximum mass 9000kg.", "Maksimum massa 9000t."],
  ])
    assert.throws(() => validateTranslations({ rule: english }, { rule: translated }), /units/);
});
