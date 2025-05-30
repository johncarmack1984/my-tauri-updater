import { configDefaults, defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  envPrefix: [
    "VITE_",
    "TAURI_PLATFORM",
    "TAURI_ARCH",
    "TAURI_FAMILY",
    "TAURI_PLATFORM_VERSION",
    "TAURI_PLATFORM_TYPE",
    "TAURI_DEBUG",
  ],
  test: {
    clearMocks: true,
    coverage: {
      include: [".scripts/**/*", "src/**/*"],
      exclude: [],
    },
    environment: "jsdom",
    globals: true,
    exclude: [
      ...configDefaults.exclude,
      // Opting not to test the @shadcn/ui imports
      "**/components/ui/**/*",
    ],
    setupFiles: ["./setup-tests.ts"],
  },
});
