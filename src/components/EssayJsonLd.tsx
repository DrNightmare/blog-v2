import { getSiteBase } from "@/lib/siteUrl";

type Props = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
};

export default function EssayJsonLd({
  slug,
  title,
  description,
  datePublished,
}: Props) {
  const base = getSiteBase();
  const url = `${base}/essays/${slug}`;
  const imageUrl = `${base}/essays/${slug}/opengraph-image`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#blogPosting`,
    headline: title,
    description,
    image: [imageUrl],
    author: {
      "@type": "Person",
      name: "Arvind Prakash",
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  if (datePublished) {
    jsonLd.datePublished = datePublished;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
