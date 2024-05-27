/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [solidPlugin()],
	build: {
		lib: {
			entry: resolve(__dirname, "src/zodactive-solid.ts"),
		},
	},
});
