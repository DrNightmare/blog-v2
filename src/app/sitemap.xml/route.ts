import { getEssays, getProjects } from "@/app/utils";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET() {
  const [essays, projects] = await Promise.all([getEssays(), getProjects()]);
  const now = new Date().toISOString();

  const staticPaths = [
    "",
    "/about",
    "/essays",
    "/notes",
    "/projects",
    "/library",
    "/resume",
    "/travel",
    "/sitemap",
  ];

  const internalProjectPaths = projects
    .filter((project) => !project.externalUrl)
    .map((project) => `/projects/${project.slug}`);

  const essayPaths = essays.map((essay) => `/essays/${essay.slug}`);
  const allPaths = [...staticPaths, ...essayPaths, ...internalProjectPaths];

  const urlsXml = allPaths
    .map(
      (path) =>
        `<url><loc>${baseUrl}${path}</loc><lastmod>${now}</lastmod></url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
