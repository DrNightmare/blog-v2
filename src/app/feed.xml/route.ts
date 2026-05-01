import { Feed } from "feed";
import {
  getEssaysSorted,
  getNoteSitemapEntries,
  getNotesIndex,
  toIsoDatePublished,
} from "@/app/utils";
import { SITE_AUTHOR_NAME, SITE_DESCRIPTION } from "@/lib/siteIdentity";
import { getSiteBase } from "@/lib/siteUrl";

export const dynamic = "force-static";

function parseDate(iso: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET() {
  const base = getSiteBase();
  const year = new Date().getFullYear();

  const feed = new Feed({
    title: SITE_AUTHOR_NAME,
    description: SITE_DESCRIPTION,
    id: base,
    link: base,
    language: "en",
    copyright: `All rights reserved ${year}, ${SITE_AUTHOR_NAME}`,
    generator: "https://github.com/jpmonette/feed",
    feedLinks: { rss: `${base}/feed.xml` },
    author: {
      name: SITE_AUTHOR_NAME,
      link: base,
    },
  });

  type Row = {
    title: string;
    link: string;
    description: string;
    date: Date | null;
  };

  const rows: Row[] = [];

  const essays = await getEssaysSorted();
  for (const e of essays) {
    const iso = toIsoDatePublished(e.metadata.date);
    rows.push({
      title: String(e.metadata.title || e.slug),
      link: `${base}/essays/${e.slug}`,
      description: String(e.metadata.summary ?? ""),
      date: parseDate(iso),
    });
  }

  const notes = await getNotesIndex();
  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  const noteEntries = await getNoteSitemapEntries();
  for (const e of noteEntries) {
    const slug = e.path.includes("#") ? e.path.split("#")[1]! : "";
    const n = bySlug.get(slug);
    const iso = n ? toIsoDatePublished(n.metadata.date) : "";
    rows.push({
      title: e.title,
      link: `${base}${e.path}`,
      description: String(n?.metadata.summary ?? ""),
      date: parseDate(iso),
    });
  }

  rows.sort((a, b) => {
    if (a.date && b.date) return b.date.getTime() - a.date.getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return 0;
  });

  const epoch = new Date(0);
  for (const r of rows) {
    feed.addItem({
      title: r.title,
      id: r.link,
      link: r.link,
      description: r.description || undefined,
      date: r.date ?? epoch,
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
