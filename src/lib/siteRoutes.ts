/** Paths included as static entries in `sitemap.xml` (relative to site root). */
export const STATIC_SITEMAP_PATHS = [
  "",
  "/about",
  "/essays",
  "/notes",
  "/projects",
  "/library",
  "/resume",
  "/travel",
  "/sitemap",
  "/feed.xml",
] as const;

/** Command palette: navigation targets (order is intentional for UX). */
export const COMMAND_PALETTE_NAV = [
  { id: "home", name: "Home", href: "/" },
  { id: "essays", name: "Essays", href: "/essays" },
  { id: "notes", name: "Notes", href: "/notes" },
  { id: "projects", name: "Projects", href: "/projects" },
  { id: "library", name: "Library", href: "/library" },
  { id: "about", name: "About", href: "/about" },
  { id: "resume", name: "Resume", href: "/resume" },
  { id: "travel", name: "Travel", href: "/travel" },
  { id: "sitemap", name: "Sitemap", href: "/sitemap" },
] as const;

/** Desktop “More” dropdown and mobile nav after the divider. */
export const MORE_NAV_LINKS = [
  { href: "/resume", label: "Resume" },
  { href: "/travel", label: "Travel" },
  { href: "/sitemap", label: "Sitemap" },
] as const;
