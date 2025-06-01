import { execSync } from "node:child_process";
import currentVersion from "./get-version";

const getReleaseNumber = (): number => {
  try {
    const tagCount = execSync("git tag | wc -l", { encoding: "utf-8" });
    return Number.parseInt(tagCount, 10) + 1;
  } catch (error) {
    console.warn("Error counting git tags, defaulting to 1:", error);
    return 1;
  }
};

const getReleaseChannelNumber = (preRelease?: string): number => {
  if (!preRelease) return 0; // Stable release
  switch (preRelease.split(".")[0]) {
    case "rc":
      return 1; // Release Candidate
    case "canary":
      return 2; // current `main`
    default:
      return 3; // Any other pre-release channel
  }
};

const getReleaseChannelVersionNumber = (preRelease?: string): number => {
  if (!preRelease) return 0; // Stable release
  return Number(preRelease.split(".")[1]);
};

const getReleaseChannel = (preRelease?: string): [number, number] => {
  return [
    getReleaseChannelNumber(preRelease),
    getReleaseChannelVersionNumber(preRelease),
  ];
};

const getMsiVersion = (version: string): string => {
  const [mainVersion, preRelease] = version.split("-");
  const [preC, preV] = getReleaseChannel(preRelease);
  const [major, minor, patch] = mainVersion
    .split(".")
    .map((n) => Number.parseInt(n, 10));
  const releaseNumber = getReleaseNumber();

  return `${major}.${minor}.${patch}-${preC + preV + releaseNumber}`;
};

const version = getMsiVersion(currentVersion);

export default version;
