import { vi } from "vitest";

// The app's existing analytics/purchase suites exercise native semantics.
// Browser suites override the external platform SDK explicitly.
vi.mock("@capacitor/core", async (original) => {
  const actual = await original<typeof import("@capacitor/core")>();
  return { ...actual, Capacitor: { ...actual.Capacitor, getPlatform: () => "android", isNativePlatform: () => true } };
});
