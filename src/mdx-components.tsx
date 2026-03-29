import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { highlight } from "sugar-high";
import CustomLink from "@/components/CustomLink";
import Pre from "@/components/CustomPre";

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
    ...components,
  };
}
