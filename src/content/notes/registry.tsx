import type { ComponentType } from "react";
import type { MDXProps } from "mdx/types";
import Note1 from "./note1.mdx";
import Note2 from "./note2.mdx";
import Note3 from "./note3.mdx";
import Note4 from "./note4.mdx";
import Note5 from "./note5.mdx";
import Note6 from "./note6.mdx";

export const noteMdxBySlug: Record<string, ComponentType<MDXProps>> = {
  note1: Note1,
  note2: Note2,
  note3: Note3,
  note4: Note4,
  note5: Note5,
  note6: Note6,
};

export function getNoteMdx(slug: string): ComponentType<MDXProps> | undefined {
  return noteMdxBySlug[slug];
}
