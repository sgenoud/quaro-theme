import { defineCollection } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * The theme's blog collection schema and loader.
 *
 * Astro only reads `src/content.config.ts` from the *consuming site*, so a
 * site re-exports this:
 *
 *   // site/src/content.config.ts
 *   export { collections } from 'quaro-theme/content.config';
 *
 * The loader `base` is resolved relative to the site's root, so posts live in
 * the site at `src/content/blog/<slug>/index.md`.
 */
const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/index.md",
    // Do not let the frontmatter slug become the content entry id: URLs are
    // handled separately via data.slug, while ids should keep tracking files.
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    slug: z
      .string()
      .min(1)
      .regex(
        /^[a-z0-9]+(?:[a-z0-9._~/-]*[a-z0-9])?$/,
        "Slugs must be lowercase URL paths without leading or trailing slashes",
      ),
    summary: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
