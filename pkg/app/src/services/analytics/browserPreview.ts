import { Capacitor } from "@capacitor/core";

// Native QA still uses native analytics. Browser design previews never send events.
export const isBrowserPreview =
  import.meta.env.DEV && import.meta.env.MODE !== "test" && Capacitor.getPlatform() === "web";
