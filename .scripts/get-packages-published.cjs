// @ts-check

const child_process = require("node:child_process");

const aliasMap = {
  frontend: "app",
  app: "app",
};

const pushMap = {
  frontend: false,
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

const fn = () => {
  return {
    include: (process.env.PACKAGES ?? "")
      .split(",")
      .map((e) => ({
        package: e,
        version: getLatest(e),
        push: pushMap[e] ?? false,
      }))
      .filter((e) => e.push === true),
  };
};

module.exports = () => fn();
