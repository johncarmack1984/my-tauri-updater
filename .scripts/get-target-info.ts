import {
  buildArchSchema,
  extensionSchema,
  type TargetInfo,
  targetPlatformSchema,
} from "./types";
import { extensionMap } from "./utils";

import { config } from "dotenv";

config({ path: ".scripts/.env" });

const env = await import("./env").then((mod) => mod.env);

const stripName = (path: string): string => path.replace(env.APP_NAME, "");

const stripVersion = (path: string): string =>
  path.replace(env.APP_VERSION, "");

const stripDebug = (path: string): string => path.replace("-debug", "");

const stripDash = (path: string): string =>
  path
    .replace("_", "")
    .replace("_", "")
    .replace("x8664", "x86_64")
    .replace("--1.", "");

const stripExtension = (path: string): string => {
  let newPath = path;
  for (const ext of extensionSchema.options) {
    if (newPath.endsWith(ext.value)) {
      newPath = newPath.replace(ext.value, "");
      break;
    }
  }
  return newPath;
};

const cleanPath = (path: string): string =>
  stripExtension(stripDash(stripDebug(stripVersion(stripName(path)))));

const getArch = (targetPath: string) => {
  const arch = cleanPath(targetPath).split(".")[0];
  const safeParsed = buildArchSchema.safeParse(arch);
  if (safeParsed.error) {
    console.error("Error parsing architecture:", safeParsed.error);
    throw new Error(`Invalid architecture: ${arch}`);
  }

  return safeParsed.data;
};

const getPlatform = (path: string) => {
  let extension = "";
  for (const ext of extensionSchema.options) {
    if (path.endsWith(ext.value)) {
      extension = extensionSchema.parse(ext.value);
      break;
    }
  }
  return targetPlatformSchema.parse(extensionMap[extension]);
};

const getTargetInfo = (targetPath: string): TargetInfo => ({
  arch: getArch(targetPath),
  platform: getPlatform(targetPath),
});

export { getTargetInfo };
