import { execSync } from "node:child_process";
import currentVersion from "./current-version";

const getReleaseNumber = (): number => {
  try {
    const tagCount = execSync("git tag | wc -l", { encoding: "utf-8" });
    return Number.parseInt(tagCount, 10) + 1;
  } catch (error) {
    console.warn("Error counting git tags, defaulting to 1:", error);
    return 1;
  }
};

const getMsiVersion = (version: string): { version: string } => {
  const [mainVersion] = version.split("-");
  const [major, minor, patch] = mainVersion
    .split(".")
    .map((n) => Number.parseInt(n, 10));
  const releaseNumber = getReleaseNumber();

  const msiVersion = Math.min(
    major * 10000 + minor * 100 + patch * 10 + (releaseNumber % 10),
    65535
  );

  return { version: msiVersion.toString() };
};

if (!require.main) console.log(getMsiVersion(currentVersion));
