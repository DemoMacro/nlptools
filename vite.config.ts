import { fileURLToPath } from "node:url";

import wasm from "vite-plugin-wasm";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [wasm()]),
  resolve: {
    alias: {
      "/__vite-plugin-wasm-helper": fileURLToPath(new URL("./wasm-helper.mjs", import.meta.url)),
    },
  },
  test: {
    benchmark: {
      reporters: ["default"],
    },
    sequence: {
      concurrent: true,
    },
  },
  fmt: {
    sortImports: {
      type: "natural",
    },
    sortPackageJson: true,
    sortTailwindcss: {},
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    "*": "vp check --fix",
  },
});
