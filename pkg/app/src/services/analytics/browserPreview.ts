import { Capacitor } from "@capacitor/core";

// Development-only purchase simulator UI. Collector policy lives in collection.ts.
export const isBrowserPreview =
  import.meta.env.DEV && import.meta.env.MODE !== "test" && Capacitor.getPlatform() === "web";
