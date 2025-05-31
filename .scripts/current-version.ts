import packageJson from "../package.json";

if (import.meta.main) console.log(packageJson.version);

export default packageJson.version;
