export type NotesJsonLdItem = {
  title: string;
  url: string;
};

type Props = {
  pageUrl: string;
  items: NotesJsonLdItem[];
};

export default function NotesIndexJsonLd({ pageUrl, items }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.title,
        url: item.url,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
