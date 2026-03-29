import type { MDXComponents } from "mdx/types";
import type { ImgHTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import { highlight } from "sugar-high";
import CustomLink from "@/components/CustomLink";
import Pre from "@/components/CustomPre";

/** When MDX omits dimensions (common for markdown `![]()`), use prose-friendly defaults. */
const DEFAULT_MDX_IMAGE_WIDTH = 800;
const DEFAULT_MDX_IMAGE_HEIGHT = 450;

function MdxImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, width, height, className } = props;
  if (!src || typeof src !== "string") return null;
  const w =
    width !== undefined && width !== ""
      ? Number(width)
      : DEFAULT_MDX_IMAGE_WIDTH;
  const h =
    height !== undefined && height !== ""
      ? Number(height)
      : DEFAULT_MDX_IMAGE_HEIGHT;
  if (Number.isNaN(w) || Number.isNaN(h)) return null;

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={w}
      height={h}
      className={`max-w-full h-auto w-full rounded-lg ${className ?? ""}`.trim()}
      sizes="(max-width: 768px) 100vw, 672px"
    />
  );
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

function MdxCode({ children, ...props }: CodeProps) {
  const codeHTML = highlight(children as string);
  return (
    <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (props) => (
      <CustomLink href={props.href} target={props.target}>
        {props.children}
      </CustomLink>
    ),
    pre: Pre,
    code: MdxCode,
    img: MdxImage,
    ...components,
  };
}
