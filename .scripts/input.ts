import { z } from "zod";
import { resolve, dirname, basename } from "node:path";

import { config } from "dotenv";

config({ path: ".scripts/.env" });

const trimRefTagPath = (val: string | undefined) =>
  val?.replace("refs/tags/", "");

const inputsSchema = z.object({
  projectPath: z
    .string()
    .optional()
    .default(".")
    .transform((val) => resolve(process.cwd(), val)),
  releaseId: z.string().catch(""),
  tagName: z.string().optional().transform(trimRefTagPath),
  releaseName: z.string().optional().transform(trimRefTagPath),
  releaseBody: z.string().catch(""),
  releaseDraft: z.boolean().catch(false),
  prerelease: z.boolean().optional().default(false),
  releaseCommitish: z.string().optional(),
  distPath: z.string().nullable(),
  iconPath: z.string().nullable(),
  appName: z.string().nullable(),
  appVersion: z.string().nullable(),
  includeDebug: z.boolean().catch(true),
  includeRelease: z.boolean().catch(true),
  includeUpdaterJson: z.boolean().catch(true),
  updaterJsonPreferNsis: z.boolean().catch(false),
  updaterJsonKeepUniversal: z.boolean().catch(false),
  tauriScript: z.string().nullable(),
  args: z.array(z.string()).catch([]),
  retryAttempts: z.number().int().nonnegative().catch(0),
  bundleIdentifier: z.string().nullable(),
  owner: z.string().catch(""),
  repo: z.string().catch(""),
});

type Inputs = z.infer<typeof inputsSchema>;

const defaultInputs: Inputs = {
  projectPath: ".",
  releaseId: "",
  tagName: "",
  releaseName: "",
  releaseBody: "",
  releaseDraft: false,
  prerelease: false,
  releaseCommitish: undefined,
  distPath: "",
  iconPath: "",
  appName: "",
  appVersion: "",
  includeDebug: true,
  includeRelease: true,
  includeUpdaterJson: true,
  updaterJsonPreferNsis: false,
  updaterJsonKeepUniversal: false,
  tauriScript: "npm run tauri",
  args: [],
  retryAttempts: 0,
  bundleIdentifier: "",
  owner: "",
  repo: "",
};

const validateInputs = (inputs: Record<string, unknown>): Inputs => {
  const parsed = inputsSchema.safeParse(inputs);
  if (!parsed.success) {
    throw new Error(
      `Invalid inputs: ${parsed.error.errors.map((e) => e.message).join(", ")}`
    );
  }
  return parsed.data;
};

export { defaultInputs, validateInputs };
