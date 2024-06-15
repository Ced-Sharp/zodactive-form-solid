/// <reference types="vitest" />

import { resolve } from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "zodactive-form-solid",
      fileName: (format) =>
        format === "es"
          ? "zodactive-form-solid.js"
          : `zodactive-form-solid.${format}.js`,
    },
    rollupOptions: {
      external: ["zod", "solid-js", "@zodactive-form/core"],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      optimizer: {
        web: {
          include: [
            "solid-js",
            "solid-testing-library",
            "@zodactive-form/core",
          ],
        },
      },
    },
    setupFiles: "./setupVitest.ts",
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
