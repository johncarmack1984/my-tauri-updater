import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Get version from command line argument
const newVersion = process.argv[2];
if (!newVersion) {
  console.error("Please provide a version number as an argument");
  process.exit(1);
}

// Validate version format (x.x.x or x.x.x-channel.n)
if (!/^\d+\.\d+\.\d+(-((dev|rc|beta|canary)\.\d+))?$/.test(newVersion)) {
  console.error(
    "Version must be in format x.x.x or x.x.x-channel.n\n" +
      "Examples:\n" +
      "  1.2.3         (stable)\n" +
      "  1.2.3-dev.123 (development)\n" +
      "  1.2.3-rc.1    (release candidate)\n" +
      "  1.2.3-beta.1  (beta)\n" +
      "  1.2.3-canary.1 (canary)"
  );
  process.exit(1);
}

const files = [
  {
    path: "package.json",
    update: (content: string) =>
      content.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`),
  },
  {
    path: "src-tauri/Cargo.toml",
    update: (content: string) =>
      content.replace(/version\s*=\s*"[^"]+"/, `version = "${newVersion}"`),
  },
];

// Update each file
for (const { path, update } of files) {
  const fullPath = join(process.cwd(), path);
  try {
    const content = readFileSync(fullPath, "utf-8");
    const updatedContent = update(content);
    writeFileSync(fullPath, updatedContent);
    console.log(`Updated version in ${path} to ${newVersion}`);
  } catch (error) {
    console.error(`Error updating ${path}:`, error);
    process.exit(1);
  }
}
