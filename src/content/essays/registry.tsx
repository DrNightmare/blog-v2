import type { ComponentType } from "react";
import type { MDXProps } from "mdx/types";
import TheFrictionlessStack from "./the-frictionless-stack.mdx";
import StreamingOpenaiCompletions from "./streaming-openai-completions.mdx";
import TestEssay from "./test-essay.mdx";

export const essayMdxBySlug: Record<string, ComponentType<MDXProps>> = {
  "the-frictionless-stack": TheFrictionlessStack,
  "streaming-openai-completions": StreamingOpenaiCompletions,
  "test-essay": TestEssay,
};

export function getEssayMdx(slug: string): ComponentType<MDXProps> | undefined {
  return essayMdxBySlug[slug];
}
