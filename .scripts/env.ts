import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import packageJson from "../package.json";

export const env = createEnv({
  server: {
    APP_NAME: z.string().catch(packageJson.name),
    APP_VERSION: z.string().catch(packageJson.version),
    TAURI_SIGNING_PRIVATE_KEY: z.string(),
    TAURI_SIGNING_PRIVATE_KEY_PASSWORD: z.string().min(0),
    GITHUB_TOKEN: z.string(),
  },
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: false,
});
