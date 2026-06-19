import { defineConfig } from "astro/config";
import quaro from "quaro-theme";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { SITE } from "./src/lib/site.ts";

export default defineConfig({
  site: SITE.siteUrl,
  // The theme injects `/`, `/[...slug]`, and `/404`. RSS and the OG card route
  // are kept as local endpoints (`src/pages/rss.xml.ts`, `src/pages/og/`) so the
  // build works regardless of how the theme is installed; to use the injected
  // versions instead, delete those files and drop the `pages` toggles.
  integrations: [
    quaro({
      site: SITE,
      styles: ["/src/styles/overrides.css"],
      pages: { rss: false, og: false },
    }),
  ],
  // Heading anchors, matching the theme's `.anchor` styles.
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: {
            className: ["anchor"],
            ariaHidden: "true",
            tabIndex: -1,
          },
          content: { type: "text", value: "#" },
        },
      ],
    ],
  },
});
