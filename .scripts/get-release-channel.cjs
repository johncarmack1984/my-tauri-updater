const fn = () => {
  const path = require("node:path");
  const fs = require("node:fs");

  const loc = path.resolve(__dirname, "../.changes/pre.json");
  const data = fs.readFileSync(loc, { encoding: "utf-8" });
  const obj = JSON.parse(data);
  const out = obj?.tag ?? "stable";

  return out.toString();
};

module.exports = () => fn();
