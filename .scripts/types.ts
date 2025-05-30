import { z } from "zod";
import { Runner } from "./runner";

const wixLanguageSchema = z.union(
  [
    z.unknown(),
    z.string(),
    z.array(z.string()),
    z.object({ language: z.string().optional() }),
  ],
  { message: "Wix language must be a string, array of strings, or an object" }
);

const applicationSchema = z.object(
  {
    tauriPath: z.string({ message: "Tauri path is required" }),
    runner: z.instanceof(Runner),
    name: z.string({ message: "Application name is required" }),
    version: z.string({ message: "Application version is required" }),
    wixLanguage: wixLanguageSchema,
  },
  { message: "Invalid application definition" }
);

export type Application = z.infer<typeof applicationSchema>;

const extensionSchema = z.union([
  z.literal(".app.tar.gz.sig"),
  z.literal(".app.tar.gz"),
  z.literal(".dmg"),
  z.literal(".AppImage.tar.gz.sig"),
  z.literal(".AppImage.tar.gz"),
  z.literal(".AppImage.sig"),
  z.literal(".AppImage"),
  z.literal(".deb"),
  z.literal(".rpm"),
  z.literal(".msi.zip.sig"),
  z.literal(".msi.zip"),
  z.literal(".msi.sig"),
  z.literal(".msi"),
  z.literal(".nsis.zip.sig"),
  z.literal(".nsis.zip"),
  z.literal(".exe.sig"),
  z.literal(".exe"),
]);

type Extension = z.infer<typeof extensionSchema>;

const targetPlatformSchema = z.union([
  z.literal("android"),
  z.literal("ios"),
  z.literal("macos"),
  z.literal("linux"),
  z.literal("windows"),
]);

type TargetPlatform = z.infer<typeof targetPlatformSchema>;

const extensionMapSchema = z.record(extensionSchema, targetPlatformSchema);

type ExtensionMap = z.infer<typeof extensionMapSchema>;

const buildArchSchema = z.union([
  z.literal("x86_64"),
  z.literal("aarch64"),
  z.literal("amd64"),
]);

type BuildArch = z.infer<typeof buildArchSchema>;

const targetInfoSchema = z.object({
  arch: buildArchSchema,
  platform: targetPlatformSchema,
});

type TargetInfo = z.infer<typeof targetInfoSchema>;

const artifactSchema = z.object({
  path: z.string({ message: "Artifact path is required" }),
  arch: buildArchSchema,
});

type Artifact = z.infer<typeof artifactSchema>;

const buildOptionsSchema = z.object({
  tauriScript: z.string().nullable(),
  args: z.array(z.string()).nullable(),
});

type BuildOptions = z.infer<typeof buildOptionsSchema>;

const initOptionsSchema = z.object({
  distPath: z.string().nullable(),
  iconPath: z.string().nullable(),
  bundleIdentifier: z.string().nullable(),
  appVersion: z.string().nullable(),
  appName: z.string().nullable(),
});

type InitOptions = z.infer<typeof initOptionsSchema>;

const cargoManifestBinSchema = z.object({
  name: z.string({ message: "Cargo manifest bin name is required" }),
});

type CargoManifestBin = z.infer<typeof cargoManifestBinSchema>;

const cargoManifestSchema = z.object({
  workspace: z
    .object({
      package: z
        .object({
          version: z.string().optional(),
          name: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  package: z.object({
    version: z.string({
      message: "Cargo manifest package version is required",
    }),
    name: z.string({ message: "Cargo manifest package name is required" }),
    "default-run": z.string().optional(),
  }),
  bin: z.array(cargoManifestBinSchema, {
    message: "Cargo manifest bins are required",
  }),
});

type CargoManifest = z.infer<typeof cargoManifestSchema>;

const infoSchema = z.object({
  tauriPath: z.string().nullable(),
  name: z.string(),
  version: z.string(),
  wixLanguage: wixLanguageSchema,
  wixAppVersion: z.string(),
  rpmRelease: z.string(),
  unzippedSigs: z.boolean(),
});

type Info = z.infer<typeof infoSchema>;

const tauriConfigV1Schema = z.object({
  package: z
    .object({
      productName: z.string().optional(),
      version: z.string().optional(),
    })
    .optional(),
  build: z
    .object({
      distDir: z.string().optional(),
      beforeBuildCommand: z.string().optional(),
    })
    .optional(),
  tauri: z.object({
    bundle: z
      .object({
        identifier: z.string({ message: "Identifier is required" }),
        rpm: z
          .object({
            release: z.string().optional(),
          })
          .optional(),
        windows: z
          .object({ wix: z.object({ language: z.string().optional() }) })
          .optional(),
      })
      .optional(),
  }),
});

type TauriConfigV1 = z.infer<typeof tauriConfigV1Schema>;

const tauriConfigV2Schema = z.object({
  identifier: z.string({ message: "Identifier is required" }),
  productName: z.string().optional(),
  version: z.string().optional(),
  build: z
    .object({
      frontendDist: z.string().optional(),
      beforeBuildCommand: z.string().optional(),
    })
    .optional(),
  bundle: z
    .object({
      createUpdaterArtifacts: z
        .union([z.boolean(), z.literal("v1Compatible")])
        .optional(),
      linux: z
        .object({
          rpm: z.object({ release: z.string().optional() }).optional(),
        })
        .optional(),
      windows: z
        .object({ wix: z.object({ language: z.string().optional() }) })
        .optional(),
    })
    .optional(),
});

type TauriConfigV2 = z.infer<typeof tauriConfigV2Schema>;

const cargoConfigSchema = z.object({
  build: z
    .object({
      target: z.string().optional(),
      "target-dir": z.string().optional(),
    })
    .optional(),
});

type CargoConfig = z.infer<typeof cargoConfigSchema>;

export {
  buildArchSchema,
  extensionSchema,
  extensionMapSchema,
  targetPlatformSchema,
  type Artifact,
  type BuildArch,
  type BuildOptions,
  type CargoConfig,
  type CargoManifest,
  type Extension,
  type ExtensionMap,
  type Info,
  type InitOptions,
  type TauriConfigV1,
  type TauriConfigV2,
  type TargetInfo,
  type TargetPlatform,
};
