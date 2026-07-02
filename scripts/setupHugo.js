// Downloads the exact Hugo (extended) release pinned in package.json's
// "hugoVersion" into ./.tools, so local builds match what CI runs
// (see .github/workflows/main.yml, which pins the same version).
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const version = pkg.hugoVersion;

if (!version) {
  console.error("No hugoVersion set in package.json");
  process.exit(1);
}

const toolsDir = path.join(root, ".tools");
const hugoBin = path.join(toolsDir, "hugo");

if (fs.existsSync(hugoBin)) {
  const current = execFileSync(hugoBin, ["version"]).toString();
  if (current.includes(`v${version}`)) {
    console.log(`.tools/hugo already at v${version}`);
    process.exit(0);
  }
}

const platform = os.platform();
const arch = os.arch();

let assetPlatform;
if (platform === "darwin") assetPlatform = "darwin-universal";
else if (platform === "linux" && arch === "arm64") assetPlatform = "linux-arm64";
else if (platform === "linux") assetPlatform = "linux-amd64";
else {
  console.error(`Unsupported platform for auto-setup: ${platform}/${arch}. Install Hugo v${version} manually into .tools/hugo.`);
  process.exit(1);
}

const url = `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_extended_${version}_${assetPlatform}.tar.gz`;
console.log(`Downloading Hugo v${version} (${assetPlatform})...`);

fs.mkdirSync(toolsDir, { recursive: true });
const tarPath = path.join(os.tmpdir(), `hugo-${version}.tar.gz`);

execFileSync("curl", ["-fL", "-o", tarPath, url], { stdio: "inherit" });
execFileSync("tar", ["-xzf", tarPath, "-C", toolsDir, "hugo"]);
fs.chmodSync(hugoBin, 0o755);
fs.rmSync(tarPath);

console.log(`Installed Hugo v${version} to .tools/hugo`);
