import { createRequire } from "node:module";
import { OGImageRoute } from "astro-og-canvas";
import { getBlogPosts, getPostSlug, ogImageSlug } from "./posts";
import { DEFAULT_SITE, type SiteConfig } from "./site";

// Cards render in HKGrotesk, bundled with the theme (TTF for CanvasKit), so the
// font travels with the package — no per-site setup. Resolve via the package
// subpath (not import.meta.url, which points at the bundled chunk at runtime),
// the same way astro-og-canvas locates its wasm. fs reads the resolved path.
const require = createRequire(import.meta.url);
const fontPath = (file: string) =>
  require.resolve(`quaro-theme/assets/fonts/${file}`);

/**
 * Per-post Open Graph card route, built from the blog collection.
 *
 * A site exposes it as a thin endpoint (kept in the site, like the RSS feed,
 * so the heavy `astro-og-canvas` dependency resolves regardless of how the
 * theme is installed):
 *
 *   // site/src/pages/og/[...slug].ts
 *   import { createBlogOgRoute } from 'quaro-theme/lib/og';
 *   import { SITE } from '../lib/site';
 *   export const { getStaticPaths, GET } = await createBlogOgRoute(SITE);
 *
 * Cards render at `/og/<slug>.png`. Enable referencing them by setting
 * `cardImages: true` in the site config.
 */
export async function createBlogOgRoute(site: SiteConfig = DEFAULT_SITE) {
  const posts = await getBlogPosts();
  const pages = Object.fromEntries(
    posts.map((post) => [ogImageSlug(getPostSlug(post)), post.data]),
  );

  return OGImageRoute({
    param: "slug",
    pages,
    getImageOptions: (_slug, data) => ({
      title: data.title,
      description: data.summary,
      bgGradient: [
        [13, 18, 28],
        [2, 6, 18],
      ],
      border: { color: [94, 173, 203], width: 16, side: "inline-start" },
      padding: 80,
      fonts: [
        fontPath("HKGrotesk-Regular.ttf"),
        fontPath("HKGrotesk-Bold.ttf"),
      ],
      font: {
        title: {
          color: [255, 255, 255],
          families: ["HK Grotesk"],
          weight: "bold",
        },
        description: { color: [128, 128, 128], families: ["HK Grotesk"] },
      },
    }),
  });
}
