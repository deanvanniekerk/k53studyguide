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
