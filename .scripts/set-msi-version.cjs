import * as version from "./get-msi-version.cjs";
import setVersion from "./set-version";

const main = (newVersion) => {
  setVersion(newVersion, true);
  console.log(`MSI version set to ${version}`);
};

main(version());
