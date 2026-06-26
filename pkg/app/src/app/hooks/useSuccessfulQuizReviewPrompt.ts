import { Preferences } from "@capacitor/preferences";
import { useCallback } from "react";
import { useAppRate } from "./useAppRate";

const SUCCESSFUL_QUIZ_REVIEW_STATE_KEY = "app-review:successful-quiz-review-state";
const SUCCESSFUL_QUIZ_REVIEW_THRESHOLD = 3;

type SuccessfulQuizReviewState = {
  successfulQuizCount: number;
  lastCountedQuizId?: string;
  reviewRequested: boolean;
};

const countedQuizIds = new Set<string>();

const defaultState: SuccessfulQuizReviewState = {
  successfulQuizCount: 0,
  reviewRequested: false,
};

const readState = async () => {
  const { value } = await Preferences.get({ key: SUCCESSFUL_QUIZ_REVIEW_STATE_KEY });
  if (!value) return defaultState;

  try {
    const state = JSON.parse(value) as Partial<SuccessfulQuizReviewState>;
    return {
      successfulQuizCount: Number.isFinite(state.successfulQuizCount) ? Number(state.successfulQuizCount) : 0,
      lastCountedQuizId: typeof state.lastCountedQuizId === "string" ? state.lastCountedQuizId : undefined,
      reviewRequested: Boolean(state.reviewRequested),
    };
  } catch {
    return defaultState;
  }
};

const writeState = async (state: SuccessfulQuizReviewState) => {
  await Preferences.set({
    key: SUCCESSFUL_QUIZ_REVIEW_STATE_KEY,
    value: JSON.stringify(state),
  });
};

export const recordSuccessfulQuizForReviewPrompt = async (quizId: string) => {
  if (!quizId || countedQuizIds.has(quizId)) return false;

  countedQuizIds.add(quizId);

  const state = await readState();
  if (state.reviewRequested || state.lastCountedQuizId === quizId) return false;

  const successfulQuizCount = state.successfulQuizCount + 1;
  const reviewRequested = successfulQuizCount >= SUCCESSFUL_QUIZ_REVIEW_THRESHOLD;

  await writeState({
    successfulQuizCount,
    lastCountedQuizId: quizId,
    reviewRequested,
  });

  return reviewRequested;
};

export const resetSuccessfulQuizReviewPromptMemoryForTests = () => {
  countedQuizIds.clear();
};

export const useSuccessfulQuizReviewPrompt = () => {
  const appRate = useAppRate();

  return useCallback(
    (quizId: string) => {
      void recordSuccessfulQuizForReviewPrompt(quizId)
        .then((shouldRequestReview) => {
          if (shouldRequestReview) void appRate.requestReview({ fallbackToStore: false });
        })
        .catch((error) => {
          console.warn("Successful quiz review prompt failed", error);
        });
    },
    [appRate],
  );
};
