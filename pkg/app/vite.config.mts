import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vitest/config";

process.env.SUPPRESS_NO_CONFIG_WARNING = process.env.SUPPRESS_NO_CONFIG_WARNING || "true";

const require = createRequire(import.meta.url);
const shouldLoadConfig = Boolean(process.env.NODE_CONFIG) || existsSync(path.resolve(process.cwd(), "config"));
const config = shouldLoadConfig
  ? (require("config") as {
      get<T>(key: string): T;
      has(key: string): boolean;
    })
  : undefined;

const getConfig = (key: string, fallback: string): string => {
  return config?.has(key) ? config.get<string>(key) : fallback;
};

const getSecretConfig = (key: string, environmentVariable: string): string => {
  return getConfig(key, process.env[environmentVariable] ?? "");
};

const getBoolConfig = (key: string, environmentVariable: string, fallback: boolean): boolean => {
  const raw = getConfig(key, process.env[environmentVariable] ?? (fallback ? "true" : "false"));
  // Azure renders boolean parameters as "True"/"False", so normalise before comparing.
  const normalized = String(raw).trim().toLowerCase();
  return normalized === "true" || normalized === "1";
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "analyze" &&
      visualizer({
        filename: "stats.html",
        gzipSize: true,
        open: false,
      }),
  ],
  build: {
    assetsDir: "dist",
    cssMinify: "esbuild",
    outDir: "build",
  },
  define: {
    __ENVIRONMENT__: JSON.stringify(getConfig("environment", mode === "production" ? "production" : "development")),
    __LOG_LEVEL__: JSON.stringify(getConfig("logLevel", "INFO")),
    __REVENUECAT_ANDROID_API_KEY__: JSON.stringify(
      getSecretConfig("revenueCat.androidApiKey", "REVENUECAT_ANDROID_API_KEY"),
    ),
    __REVENUECAT_IOS_API_KEY__: JSON.stringify(getSecretConfig("revenueCat.iosApiKey", "REVENUECAT_IOS_API_KEY")),
    __SHOW_DEBUG__: JSON.stringify(getBoolConfig("showDebug", "SHOW_DEBUG", mode !== "production")),
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}"],
  },
}));
