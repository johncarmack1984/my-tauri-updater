import { getTagName, getVersion } from "./utils";
import * as fs from "node:fs";
import * as path from "node:path";
import { existsSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";

// import * as core from "@actions/core";
// import { context } from "@actions/github";
import stringArgv from "string-argv";

import { getOrCreateRelease } from "./create-release";
import { uploadAssets as uploadReleaseAssets } from "./upload-release-assets";
import { uploadVersionJSON } from "./upload-version-json";
import { buildProject } from "./build";
import { execCommand, getInfo } from "./utils";

import type { Artifact, BuildOptions, InitOptions } from "./types";
import * as input from "./input";

import { env } from "./env";
import { getTargetInfo } from "./get-target-info";

const config = {};

async function run(): Promise<void> {
  try {
    const inputs = input.validateInputs(input.defaultInputs);
    const {
      projectPath,
      distPath,
      iconPath,
      appName,
      appVersion,
      includeRelease,
      includeDebug,
      includeUpdaterJson,
      tauriScript,
      args,
      bundleIdentifier,
      owner,
      repo,
      releaseDraft: draft,
      prerelease,
      releaseCommitish: commitish,
      updaterJsonPreferNsis,
      updaterJsonKeepUniversal,
      retryAttempts,
    } = inputs;
    let releaseId = inputs.releaseId;
    let tagName = inputs.tagName ?? getTagName(getVersion());
    let releaseName = inputs.releaseName;
    let body = inputs.releaseBody;
    const buildOptions: BuildOptions = {
      tauriScript,
      args,
    };
    const initOptions: InitOptions = {
      distPath,
      iconPath,
      bundleIdentifier,
      appName,
      appVersion,
    };
    const targetArgIdx = [...args].findIndex(
      (e) => e === "-t" || e === "--target"
    );
    const targetPath =
      targetArgIdx >= 0 ? [...args][targetArgIdx + 1] : undefined;
    const configArgIdx = [...args].findIndex(
      (e) => e === "-c" || e === "--config"
    );
    const configArg =
      configArgIdx >= 0 ? [...args][configArgIdx + 1] : undefined;
    const releaseArtifacts: Artifact[] = [];
    const debugArtifacts: Artifact[] = [];
    if (includeRelease) {
      console.log("build release");
      console.log(projectPath);
      releaseArtifacts.push(
        ...(await buildProject(
          projectPath,
          false,
          buildOptions,
          initOptions,
          retryAttempts
        ))
      );
    }
    if (includeDebug) {
      console.log("build debug");
      debugArtifacts.push(
        ...(await buildProject(
          projectPath,
          true,
          buildOptions,
          initOptions,
          retryAttempts
        ))
      );
    }
    const outputDir = path.join(__dirname, "../release");
    console.log("Output directory:", outputDir);
    const asset = fs.readdirSync(outputDir).sort();
    const assetData = asset.map((file) => {
      const filePath = path.join(outputDir, file);
      const data = fs.readFileSync(filePath, "utf8");
      return data;
    });
    console.log("asset", asset);
    // // console.log("Asset data:", assetData);
    // const artifacts: Artifact[] = asset.map((f): Artifact => {
    //   return {
    //     arch: "",
    //     path: path.join(outputDir, f),
    //   };
    // });
    // const artifacts = releaseArtifacts.concat(debugArtifacts);
    // const artifacts = asset;
    // if (artifacts.length === 0) {
    //   if (releaseId || tagName) {
    //     throw new Error("No artifacts were found.");
    //   } else {
    //     console.log(
    //       "No artifacts were found. The action was not configured to upload artifacts, therefore this is not handled as an error."
    //     );
    //     return;
    //   }
    // }
    // interface Output {
    //   releaseId?: string;
    //   releaseHtmlUrl?: string;
    //   releaseUploadUrl?: string;
    //   appVersion?: string;
    //   artifactPaths?: string;
    // }
    // const runOutput: Output = {};
    // runOutput.artifactPaths = artifacts.map((a) => a).join("\n");
    // console.log(`Found artifacts:\n${runOutput.artifactPaths}`);
    // const targetInfo = getTargetInfo(targetPath);
    // const info = getInfo(projectPath, targetInfo, configArg);
    // runOutput.appVersion = info.version;
    // // Other steps may benefit from this so we do this whether or not we want to upload it.
    // if (targetInfo.platform === "macos") {
    //   let i = 0;
    //   for (let artifact of artifacts) {
    //     // updater provide a .tar.gz, this will prevent duplicate and overwriting of
    //     // signed archive
    //     if (
    //       artifact.path.endsWith(".app") &&
    //       !existsSync(`${artifact.path}.tar.gz`)
    //     ) {
    //       console.log(
    //         `Packaging ${artifact.path} directory into ${artifact.path}.tar.gz`
    //       );
    //       await execCommand("tar", [
    //         "czf",
    //         `${artifact.path}.tar.gz`,
    //         "-C",
    //         dirname(artifact.path),
    //         basename(artifact.path),
    //       ]);
    //       artifact.path += ".tar.gz";
    //     } else if (artifact.path.endsWith(".app")) {
    //       // we can't upload a directory
    //       artifacts.splice(i, 1);
    //     }
    //     i++;
    //   }
    // }
    // // If releaseId is set we'll use this to upload the assets to.
    // // If tagName is set we will try to upload assets to the release associated with the given tagName.
    // // If there's no release for that tag, we require releaseName to create a new one.
    // if (tagName && !releaseId) {
    // const templates = [
    //   {
    //     key: "__VERSION__",
    //     value: info.version,
    //   },
    // ];
    // templates.forEach((template) => {
    //   const regex = new RegExp(template.key, "g");
    //   tagName = tagName?.replace(regex, template.value);
    //   releaseName = releaseName?.replace(regex, template.value);
    //   body = body?.replace(regex, template.value);
    // });
    // const releaseData = await getOrCreateRelease(
    //   owner,
    //   repo,
    //   tagName,
    //   releaseName || undefined,
    //   body,
    //   commitish || undefined,
    //   draft,
    //   prerelease
    // );
    // releaseId = releaseData?.id;
    // runOutput.releaseUploadUrl = releaseData?.uploadUrl;
    // runOutput.releaseId = releaseData?.id;
    // runOutput.releaseHtmlUrl = releaseData?.htmlUrl;
    // if (releaseId) {
    // await uploadReleaseAssets(owner, repo, releaseId, artifacts);
    // if (includeUpdaterJson) {
    //   await uploadVersionJSON({
    //     owner,
    //     repo,
    //     version: info.version,
    //     notes: body,
    //     tagName,
    //     releaseId,
    //     artifacts: [],
    //     // artifacts:
    //     //   releaseArtifacts.length !== 0 ? releaseArtifacts : debugArtifacts,
    //     targetInfo,
    //     unzippedSig: info.unzippedSigs,
    //     updaterJsonPreferNsis,
    //     updaterJsonKeepUniversal,
    //   });
    // }
    // }
  } catch (error) {
    throw error;
    // core.setFailed(error.message);
  }
}

await run();
