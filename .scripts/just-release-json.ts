import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";
import { getTargetInfo } from "./get-target-info";

const outputDir = path.join(__dirname, "../release");

const getFiles = () =>
  fs
    .readdirSync(outputDir)
    .filter((f) => f !== "latest.json")
    .sort();

// const getTargets = (arr: string[]) => arr.map(getTargetInfo);

const main = () => {
  process.stdout.write("Getting release files");
  const files = getFiles();
  const targets = files.map(getTargetInfo);
  process.stdout.write("...✅ done\n");
  console.log("files", files);
};

main();
