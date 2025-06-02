const path = require("node:path");
const fs = require("node:fs");

const fn = () => {
  const loc = path.resolve(__dirname, "../.changes/pre.json");
  if (!fs.existsSync(loc)) {
    return "stable";
  }
  const data = fs.readFileSync(loc, { encoding: "utf-8" });
  const obj = JSON.parse(data);
  out = obj?.tag ?? "stable";
  return out.toString();
};

console.log("Release channnel:", fn());

module.exports = () => fn();
