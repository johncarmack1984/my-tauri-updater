import fs from "node:fs";

import { getOctokit } from "@actions/github";

import { getAssetName } from "./utils";
import type { Artifact } from "./types";

import { config } from "dotenv";

config({ path: ".scripts/.env" });

const env = await import("./env").then((mod) => mod.env);

export async function uploadAssets(
  owner: string,
  repo: string,
  releaseId: string,
  assets: Artifact[]
) {
  if (env.GITHUB_TOKEN === undefined) {
    throw new Error("GITHUB_TOKEN is required");
  }

  const github = getOctokit(env.GITHUB_TOKEN);

  // const existingAssets = (
  //   await github.rest.repos.listReleaseAssets({
  //     owner: owner,
  //     repo: repo,
  //     release_id: releaseId,
  //     per_page: 100,
  //   })
  // ).data;

  // Determine content-length for header to upload asset
  const contentLength = (filePath: string) => fs.statSync(filePath).size;

  for (const asset of assets) {
    console.log("asset", JSON.stringify(asset));
    // const headers = {
    //   "content-type": "application/zip",
    //   "content-length": contentLength(asset.path),
    // };

    // const assetName = getAssetName(asset.path);

    // const existingAsset = existingAssets.find(
    //   (a) =>
    //     a.name ===
    //     assetName
    //       .trim()
    //       .replace(/[ ()[\]{}]/g, ".")
    //       .replace(/\.\./g, ".")
    //       .normalize("NFD")
    //       .replace(/[\u0300-\u036f]/g, "")
    // );
    // if (existingAsset) {
    //   console.log(`Deleting existing ${assetName}...`);
    //   await github.rest.repos.deleteReleaseAsset({
    //     owner: owner,
    //     repo: repo,
    //     asset_id: existingAsset.id,
    //   });
    // }

    // console.log(`Uploading ${assetName}...`);

    // await github.rest.repos.uploadReleaseAsset({
    //   headers,
    //   name: assetName,
    //   // https://github.com/tauri-apps/tauri-action/pull/45
    //   // @ts-expect-error error TS2322: Type 'Buffer' is not assignable to type 'string'.
    //   data: fs.createReadStream(asset.path),
    //   owner: owner,
    //   repo: repo,
    //   release_id: releaseId,
    // });
  }
}
