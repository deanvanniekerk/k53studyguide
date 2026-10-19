import { globSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        "404": resolve(__dirname, "404.html"),
        ...Object.fromEntries(
          globSync("study/**/index.html", { cwd: __dirname }).map((path) => [path, resolve(__dirname, path)]),
        ),
        "k53-road-signs": resolve(__dirname, "k53-road-signs.html"),
        "vehicle-controls": resolve(__dirname, "vehicle-controls.html"),
        "k53-practice-questions": resolve(__dirname, "k53-practice-questions.html"),
        privacy: resolve(__dirname, "privacy.html"),
        terms: resolve(__dirname, "terms.html"),
      },
    },
  },
});
