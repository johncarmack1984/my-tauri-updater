const version = require("./get-msi-version.cjs");
const setVersion = require("./set-version.cjs");

const main = (newVersion) => {
  setVersion(newVersion, true);
  console.log(`MSI version set to ${newVersion}`);
  return newVersion;
};

console.log(main(process.env.VERSION ?? version()));

module.exports = () => main(version());
