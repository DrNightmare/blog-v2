/**
 * Fetches Open Library search results per book and writes coverUrl + openLibraryUrl
 * into src/app/library/data.json (prefetch for next/image).
 *
 * Usage: node scripts/enrich-library-openlibrary.mjs [--dry-run]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "src", "app", "library", "data.json");

const dryRun = process.argv.includes("--dry-run");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeIsbn(s) {
  return String(s).replace(/-/g, "").trim();
}

async function searchOpenLibrary(title, author) {
  const q = `${title} ${author}`.trim();
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open Library HTTP ${res.status} for ${q}`);
  return res.json();
}

async function main() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const books = JSON.parse(raw);
  if (!Array.isArray(books)) {
    console.error("Expected data.json to be a JSON array");
    process.exit(1);
  }

  const out = [];

  for (const book of books) {
    const { title, author } = book;
    const next = { ...book };
    delete next.coverUrl;
    delete next.openLibraryUrl;

    try {
      const data = await searchOpenLibrary(title, author);
      const doc = data.docs?.[0];

      if (!doc) {
        console.warn(`[library:enrich] No match: "${title}" (${author})`);
        out.push(next);
        await sleep(200);
        continue;
      }

      const olTitle = doc.title || doc.title_suggest?.[0] || "(unknown)";
      if (String(olTitle).toLowerCase() !== String(title).toLowerCase()) {
        console.warn(
          `[library:enrich] "${title}" -> OL first hit "${olTitle}"`
        );
      }

      let coverUrl = null;
      if (doc.cover_i != null) {
        coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
      } else if (Array.isArray(doc.isbn) && doc.isbn.length > 0) {
        const isbn = normalizeIsbn(doc.isbn[0]);
        if (isbn) {
          coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
        }
      }

      if (coverUrl) next.coverUrl = coverUrl;
      if (doc.key) next.openLibraryUrl = `https://openlibrary.org${doc.key}`;
    } catch (e) {
      console.error(`[library:enrich] "${title}" (${author}):`, e.message || e);
    }

    out.push(next);
    await sleep(200);
  }

  if (dryRun) {
    console.log(JSON.stringify(out, null, 4));
    console.log("[library:enrich] dry-run: not writing");
    return;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(out, null, 4) + "\n", "utf8");
  console.log(`[library:enrich] Wrote ${out.length} books to ${DATA_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
