import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { runScripts: "outside-only" } },
    include: ["tests/**/*.test.tsx", "tests/**/*.test.ts"],
  },
});
