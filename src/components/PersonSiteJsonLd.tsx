import { getSiteBase } from "@/lib/siteUrl";
import { SAME_AS_URLS, SITE_AUTHOR_NAME } from "@/lib/siteIdentity";

export default function PersonSiteJsonLd() {
  const base = getSiteBase();
  const websiteId = `${base}/#website`;
  const personId = `${base}/#person`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: base,
        name: SITE_AUTHOR_NAME,
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: SITE_AUTHOR_NAME,
        url: base,
        sameAs: SAME_AS_URLS,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
