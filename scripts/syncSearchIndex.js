// Keeps the static search-index fallback (served when /searchindex.json
// fails to load at runtime) in sync with the real Hugo-generated index.
// Runs after `hugo build` as part of `npm run build`.
const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "public", "searchindex.json");
const publicFallback = path.join(__dirname, "..", "public", "static-searchindex.json");
const repoFallback = path.join(__dirname, "..", "static", "static-searchindex.json");

if (!fs.existsSync(source)) {
  console.error("syncSearchIndex: public/searchindex.json not found, skipping sync.");
  process.exit(0);
}

fs.copyFileSync(source, publicFallback);
fs.copyFileSync(source, repoFallback);
console.log("syncSearchIndex: static-searchindex.json synced from build output.");
