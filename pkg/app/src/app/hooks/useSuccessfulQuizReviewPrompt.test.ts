import { Preferences } from "@capacitor/preferences";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  recordSuccessfulQuizForReviewPrompt,
  resetSuccessfulQuizReviewPromptMemoryForTests,
} from "./useSuccessfulQuizReviewPrompt";

vi.mock("@capacitor/preferences", () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

const getPreferences = vi.mocked(Preferences.get);
const setPreferences = vi.mocked(Preferences.set);

describe("useSuccessfulQuizReviewPrompt", () => {
  let storedValue: string | null;

  beforeEach(() => {
    storedValue = null;
    resetSuccessfulQuizReviewPromptMemoryForTests();
    getPreferences.mockImplementation(async () => ({ value: storedValue }));
    setPreferences.mockImplementation(async ({ value }) => {
      storedValue = value;
    });
  });

  it("requests review on the third successful quiz", async () => {
    await expect(recordSuccessfulQuizForReviewPrompt("quiz-1")).resolves.toEqual(false);
    await expect(recordSuccessfulQuizForReviewPrompt("quiz-2")).resolves.toEqual(false);
    await expect(recordSuccessfulQuizForReviewPrompt("quiz-3")).resolves.toEqual(true);

    expect(JSON.parse(storedValue ?? "{}")).toEqual({
      successfulQuizCount: 3,
      lastCountedQuizId: "quiz-3",
      reviewRequested: true,
    });
  });

  it("does not count the same quiz twice", async () => {
    await expect(recordSuccessfulQuizForReviewPrompt("quiz-1")).resolves.toEqual(false);
    await expect(recordSuccessfulQuizForReviewPrompt("quiz-1")).resolves.toEqual(false);

    expect(JSON.parse(storedValue ?? "{}")).toEqual({
      successfulQuizCount: 1,
      lastCountedQuizId: "quiz-1",
      reviewRequested: false,
    });
  });

  it("does not request review again after the milestone has fired", async () => {
    storedValue = JSON.stringify({
      successfulQuizCount: 3,
      lastCountedQuizId: "quiz-3",
      reviewRequested: true,
    });

    await expect(recordSuccessfulQuizForReviewPrompt("quiz-4")).resolves.toEqual(false);

    expect(JSON.parse(storedValue)).toEqual({
      successfulQuizCount: 3,
      lastCountedQuizId: "quiz-3",
      reviewRequested: true,
    });
  });
});
