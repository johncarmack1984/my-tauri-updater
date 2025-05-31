import { defineConfig, Options } from "tsup";

export default defineConfig({
  entry: [".scripts/print-*.ts", ".scripts/set-*.ts"],
  format: ["esm"],
  outExtension: () => ({ js: ".mjs" }),
  platform: "node",
  outDir: ".dist",
  clean: true,
  splitting: false,
  minify: true,
});
