import type { RootState } from "@/state";
import { ownedSelector } from "@/state/purchase";

export type AccessModel = "mobile" | "free_web";
export const accessModelSelector = (state: RootState): AccessModel => state.access?.model ?? "mobile";
export const canTakeMockTestsSelector = (state: RootState) =>
  accessModelSelector(state) === "free_web" || ownedSelector(state);
export const canResetHistorySelector = canTakeMockTestsSelector;
export const showsPremiumOffersSelector = (state: RootState) =>
  accessModelSelector(state) === "mobile" && !ownedSelector(state);
export const showsMobileAppLinksSelector = (state: RootState) => accessModelSelector(state) === "free_web";
export const selectAccessModel = (environment: string, platform: string, search = ""): AccessModel =>
  platform === "web" && !(environment !== "production" && new URLSearchParams(search).get("access") === "mobile")
    ? "free_web"
    : "mobile";
