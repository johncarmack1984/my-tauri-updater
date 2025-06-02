const { execSync } = require("node:child_process");
const getVersion = require("./get-version.cjs");

const getReleaseNumber = () => {
  try {
    const tagCount = execSync("git tag | wc -l", { encoding: "utf-8" });
    return Number.parseInt(tagCount, 10) + 1;
  } catch (error) {
    console.warn("Error counting git tags, defaulting to 1:", error);
    return 1;
  }
};

const getReleaseChannelNumber = (preRelease) => {
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

const getReleaseChannelVersionNumber = (preRelease) => {
  if (!preRelease) return 0; // Stable release
  return Number(preRelease.split(".")[1]);
};

const getReleaseChannel = (preRelease) => {
  return [
    getReleaseChannelNumber(preRelease),
    getReleaseChannelVersionNumber(preRelease),
  ];
};

const getMsiVersion = (version) => {
  const [mainVersion, preRelease] = version.split("-");
  const [preC, preV] = getReleaseChannel(preRelease);
  if (preC === 0 && preV === 0) {
    return mainVersion; // Stable release, no pre-release info
  }
  const [major, minor, patch] = mainVersion
    .split(".")
    .map((n) => Number.parseInt(n, 10));
  const releaseNumber = getReleaseNumber();

  return `${major}.${minor}.${patch}-${preC + preV + releaseNumber}`;
};

module.exports = () => getMsiVersion(getVersion());
