import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  external: ["prismjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
});
