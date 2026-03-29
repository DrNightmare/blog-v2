import type { FC } from "react";

declare module "*.mdx" {
  const MDXComponent: FC;
  export default MDXComponent;
}
