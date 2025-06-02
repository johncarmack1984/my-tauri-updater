// @ts-check

const child_process = require("node:child_process");

const aliasMap = {
  frontend: "app",
  app: "app",
};

const pushMap = {
  app: true,
};

const getLatest = (packageName) =>
  child_process
    .execSync(
      `git tag -l --sort=-v:refname '${aliasMap[packageName]}-*' | xargs | cut -d ' ' -f1 | xargs`,
      { encoding: "utf-8" }
    )
    .trim()
    .replace(`${aliasMap[packageName]}-v`, "");

const getNext = (packageName) =>
  child_process
    .execSync(
      `covector status | awk -F'${aliasMap[packageName]}@' '{print $2}' | tail -n 1 | xargs`,
      { encoding: "utf-8" }
    )
    .trim()
    .replace(`${aliasMap[packageName]}-v`, "");

const fn = () => ({
  include: (process.env.PACKAGES ?? "")
    .split(",")
    .filter((e) => e in pushMap)
    .map((e) => ({
      package: e,
      version: getNext(e),
    })),
});

console.log("\npackages-published\n", fn());

module.exports = () => fn();
