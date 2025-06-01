import { execSync } from "node:child_process";
import * as path from "node:path";

export const command = () =>
  `node "${path
    .relative(
      process.cwd(),
      path.join(import.meta.dirname, "../node_modules/covector/bin/covector.js")
    )
    .split(path.sep)
    .join(
      "/"
    )}" status | grep 'app:' | sed 's/app://' | xargs | cut -d ' ' -f1`;

const getReleaseType = async () => {
  const cmd = command();
  const result = execSync(cmd, { encoding: "utf-8" });
  return result.trim();
};

const releaseType = await getReleaseType();

export default releaseType;
