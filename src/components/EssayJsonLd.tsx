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
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base.replace(/\/$/, "")}/essays/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished,
    author: {
      "@type": "Person",
      name: "Arvind Prakash",
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
