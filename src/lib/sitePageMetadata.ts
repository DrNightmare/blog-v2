import type { Metadata } from "next";

type ListPageOpts = {
  title: string;
  description: string;
  path: `/${string}`;
};

export function listPageMetadata(opts: ListPageOpts): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: opts.path,
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      type: "website",
      url: opts.path,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
  };
}

export const homeMetadata: Metadata = {
  title: { absolute: "Arvind Prakash" },
  description:
    "Staff engineer building elegant systems. Essays, notes, projects, and experiments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Arvind Prakash",
    description:
      "Staff engineer building elegant systems. Essays, notes, projects, and experiments.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arvind Prakash",
    description:
      "Staff engineer building elegant systems. Essays, notes, projects, and experiments.",
  },
};
