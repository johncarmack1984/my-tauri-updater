type PreReleaseConfig = {
  tag: string;
  changes: string[];
};

type ConfigModule = {
  default?: PreReleaseConfig;
};

const channel = await import("../.changes/pre.json").then(
  (m?: ConfigModule) => m?.default?.tag ?? "stable"
);

export default channel;
