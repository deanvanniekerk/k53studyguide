import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

const appQuestionImagesRoot = resolve(__dirname, "../app/public/assets/images");
const quizQuestionImagesPath = "/quiz-assets/images";
const includeQuizQuestionImages = process.env.LANDER_INCLUDE_QUIZ_IMAGES !== "0";

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const copyDirectory = (source: string, destination: string) => {
  mkdirSync(destination, { recursive: true });

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      continue;
    }

    if (!entry.isFile()) continue;

    mkdirSync(dirname(destinationPath), { recursive: true });
    copyFileSync(sourcePath, destinationPath);
  }
};

const quizQuestionImagesPlugin = (): Plugin => ({
  name: "quiz-question-images",
  configureServer(server: ViteDevServer) {
    server.middlewares.use(quizQuestionImagesPath, (request, response, next) => {
      const requestPath = decodeURIComponent(new URL(request.url ?? "", "http://localhost").pathname);
      const filePath = normalize(join(appQuestionImagesRoot, requestPath));

      if (!filePath.startsWith(appQuestionImagesRoot)) {
        response.statusCode = 403;
        response.end();
        return;
      }

      if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        next();
        return;
      }

      response.setHeader("Cache-Control", "public, max-age=3600");
      response.setHeader("Content-Type", contentTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream");
      createReadStream(filePath).pipe(response);
    });
  },
  closeBundle() {
    if (!includeQuizQuestionImages) return;

    copyDirectory(appQuestionImagesRoot, resolve(__dirname, "dist/quiz-assets/images"));
  },
});

export default defineConfig({
  plugins: [react(), quizQuestionImagesPlugin()],
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy.html"),
        terms: resolve(__dirname, "terms.html"),
      },
    },
  },
});
