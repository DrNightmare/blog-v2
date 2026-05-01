/** Public name (author, site title default). */
export const SITE_AUTHOR_NAME = "Arvind Prakash";

/** Default meta / RSS description (keep in sync with root layout intent). */
export const SITE_DESCRIPTION =
  "Head of engineering building elegant systems. Essays, notes, projects, and experiments.";

/**
 * Social profiles (order = footer display order). URLs feed `sameAs` in JSON-LD.
 */
export const SOCIAL_PROFILES = [
  {
    url: "https://github.com/DrNightmare",
    label: "GitHub" as const,
  },
  {
    url: "https://www.youtube.com/@ArvindPrakash94",
    label: "YouTube" as const,
  },
] as const;

export const SAME_AS_URLS: string[] = SOCIAL_PROFILES.map((p) => p.url);
