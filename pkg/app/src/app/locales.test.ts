import { matchDeviceLocale, releasedLocales, resolveLocale } from "@k53studyguide/shared/data";

it("releases exactly the four languages and matches supported regional device tags", () => {
  expect(releasedLocales.map(({ code }) => code)).toEqual(["en", "af", "zu", "xh"]);
  for (const [tag, locale] of [
    ["en-ZA", "en"],
    ["af-ZA", "af"],
    ["zu-ZA", "zu"],
    ["xh-ZA", "xh"],
  ]) {
    expect(matchDeviceLocale([tag])).toBe(locale);
  }
  expect(matchDeviceLocale(["fr-FR", "xh-ZA"])).toBe("xh");
  expect(matchDeviceLocale(["fr-FR"])).toBe("en");
  expect(matchDeviceLocale([])).toBe("en");
  expect(resolveLocale("invalid")).toBe("en");
});

it("loads the selected locale over English without requiring the other dictionaries", async () => {
  const { loadLocale, translations } = await import("@k53studyguide/shared/data");
  expect(translations.study.af).toBeUndefined();
  const af = await loadLocale("af");
  expect(af.study.af).toBe("Studeer");
  expect(af.quiz.af).toBe("Vasvra");
  expect(af.study.zu).toBeUndefined();
  expect((await loadLocale("zu")).quiz.zu).toBe("Imibuzo");
  expect((await loadLocale("xh")).quiz.xh).toBe("Ikhwizi");
  expect((await loadLocale("invalid")).study.en).toBe("Study");
});
