/**
 * Ensures every *.mdx slug under content/essays and content/notes has a matching
 * key in the corresponding registry.tsx (bundler-friendly explicit imports).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function slugsFromDir(relativeDir) {
  const dir = path.join(root, relativeDir);
  const names = fs.readdirSync(dir);
  return names
    .filter((f) => path.extname(f) === ".mdx")
    .map((f) => path.basename(f, ".mdx"));
}

function registryHasSlug(registryText, slug) {
  const d = `"${slug}":`;
  const s = `'${slug}':`;
  const bare = `${slug}:`;
  return registryText.includes(d) || registryText.includes(s) || registryText.includes(bare);
}

function check(collection, registryRelativePath, objectName) {
  const registryPath = path.join(root, registryRelativePath);
  const registryText = fs.readFileSync(registryPath, "utf8");
  const missing = [];
  for (const slug of slugsFromDir(collection)) {
    if (!registryHasSlug(registryText, slug)) {
      missing.push(slug);
    }
  }
  if (missing.length) {
    console.error(
      `[check-content-registry] ${objectName} in ${registryRelativePath} is missing keys for MDX file(s): ${missing.join(", ")}`
    );
    process.exit(1);
  }
}

check("src/content/essays", "src/content/essays/registry.tsx", "essayMdxBySlug");
check("src/content/notes", "src/content/notes/registry.tsx", "noteMdxBySlug");
console.log("[check-content-registry] OK");
