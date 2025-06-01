// @ts-check
const path = require("node:path");
const fs = require("node:fs");

const getReleaseChannel = () => {
  const loc = path.resolve(__dirname, "../.changes/pre.json");
  const data = fs.readFileSync(loc, { encoding: "utf-8" });
  const obj = JSON.parse(data);
  const out = obj?.tag ?? "stable";
  console.log("getReleaseChannel: ", out);
  return out.toString();
};

const getPrereleaseMatrix = () => {
  const loc = path.resolve(
    __dirname,
    "./../.github/fixtures/matrix_publish_prerelease.json"
  );
  const data = fs.readFileSync(loc, { encoding: "utf-8" });
  return { include: JSON.parse(data) };
};

const getStableMatrix = () => {
  const loc = path.resolve(
    __dirname,
    "./../.github/fixtures/matrix_publish_stable.json"
  );
  const data = fs.readFileSync(loc, { encoding: "utf-8" });
  return { include: JSON.parse(data) };
};

const getBuildMatrix = () => {
  switch (getReleaseChannel()) {
    case "stable":
      return getStableMatrix();
    default:
      return getPrereleaseMatrix();
  }
};

console.log("getBuildMatrix: ", getBuildMatrix());

module.exports = () => getBuildMatrix();
