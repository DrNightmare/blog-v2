import type { MetadataRoute } from "next";
import {
  getEssaysIndex,
  getProjects,
  getNoteSitemapEntries,
} from "@/app/utils";
import { STATIC_SITEMAP_PATHS } from "@/lib/siteRoutes";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [essays, projects, noteEntries] = await Promise.all([
    getEssaysIndex(),
    getProjects(),
    getNoteSitemapEntries(),
  ]);

  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_SITEMAP_PATHS.map((path) => ({
    url: new URL(path, baseUrl).href,
    lastModified,
  }));

  for (const essay of essays) {
    entries.push({
      url: new URL(`/essays/${essay.slug}`, baseUrl).href,
      lastModified,
    });
  }

  for (const entry of noteEntries) {
    entries.push({
      url: new URL(entry.path, baseUrl).href,
      lastModified,
    });
  }

  for (const project of projects) {
    if (!project.externalUrl) {
      entries.push({
        url: new URL(`/projects/${project.slug}`, baseUrl).href,
        lastModified,
      });
    }
  }

  return entries;
}
