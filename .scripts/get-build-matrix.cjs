// @ts-check

const getPackagesPublished = require("./get-packages-published.cjs");
const path = require("node:path");
const fs = require("node:fs");

const getReleaseChannel = () => {
  const loc = path.resolve(__dirname, "../.changes/pre.json");
  if (!fs.existsSync(loc)) {
    return "stable";
  }
  const data = fs.readFileSync(loc, { encoding: "utf-8" });
  const obj = JSON.parse(data);
  const out = obj?.tag ?? "stable";
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
  const channel = getReleaseChannel();
  switch (channel) {
    case "stable": {
      return getStableMatrix();
    }
    default: {
      return getPrereleaseMatrix();
    }
  }
};

const fn = () => ({
  include: getPackagesPublished()
    .include.map((p) =>
      getBuildMatrix().include.map((/** @type {any} */ e) => ({
        ...p,
        ...e,
      }))
    )
    .flat(),
});

console.log("\nbuild-matrix\n", fn());

module.exports = () => fn();
