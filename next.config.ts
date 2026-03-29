import createMDX from '@next/mdx';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async headers() {
    return [
      {
        source: "/data/world-110m.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // String plugin names + serializable options (see remark-frontmatter v5: use 'yaml', not {})
  options: {
    remarkPlugins: [
      ["remark-frontmatter", "yaml"],
      ["remark-gfm"],
    ],
  },
});

export default withMDX(nextConfig);
