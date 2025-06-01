import * as fs from "node:fs";

type PreReleaseConfig = {
  tag: string;
  changes: string[];
};

type ConfigModule = {
  default?: PreReleaseConfig;
};

const getPreJson = async () => {
  const filePath = "../.changes/pre.json";
  if (fs.existsSync(filePath)) {
    return await import(filePath)
      .then((m?: ConfigModule) => m?.default?.tag ?? "stable")
      .catch(() => "stable");
  }
  return "stable";
};

const channel = await getPreJson();

export default channel;
