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
  const pkgStr = process.env.PACKAGES ?? "";
  const packages = pkgStr.length ? pkgStr.split(",") : [];
  if (packages.length === 0) {
    console.log("No packages published.");
    return packages;
  }
  console.log("Packages published:", packages);
  return {
    include: packages
      .map((e) => ({
        package: e,
        version: getLatest(e),
        push: pushMap[e] ?? false,
      }))
      .filter((e) => e.push === true),
  };
};

module.exports = () => fn();
