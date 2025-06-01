import { defineConfig, Options } from "tsup";

export default defineConfig({
  entry: [".scripts/print-*.ts", ".scripts/set-*.ts", ".scripts/parse-*.ts"],
  format: ["esm"],
  outExtension: () => ({ js: ".cjs" }),
  platform: "node",
  shims: true,
  outDir: ".dist",
  clean: true,
  splitting: false,
  minify: false,
  target: "node22",
});
