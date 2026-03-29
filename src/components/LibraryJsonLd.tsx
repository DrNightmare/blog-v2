export type LibraryJsonLdBook = {
  title: string;
  author: string;
  position: number;
  url?: string;
};

type Props = {
  items: LibraryJsonLdBook[];
};

export default function LibraryJsonLd({ items }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((book) => ({
      "@type": "ListItem",
      position: book.position,
      item: {
        "@type": "Book",
        ...(book.url ? { url: book.url } : {}),
        name: book.title,
        author: {
          "@type": "Person",
          name: book.author,
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
