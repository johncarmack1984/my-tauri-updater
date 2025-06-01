const fn = () => {
  const path = require("node:path");
  const fs = require("node:fs");

  const loc = path.resolve(__dirname, "../package.json");
  const data = fs.readFileSync(loc, { encoding: "utf-8" });
  const obj = JSON.parse(data);
  const out = obj?.version ?? "0.0.0";

  return out.toString();
};

module.exports = () => fn();
