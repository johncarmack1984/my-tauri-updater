import version from "./get-msi-version";
import setVersion from "./set-version";

const main = (newVersion: string) => {
  setVersion(newVersion, true);
  console.log(`MSI version set to ${version}`);
};

main(version);
