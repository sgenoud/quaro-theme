import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogPosts, getPostSlug } from "./posts";
import type { SiteConfig } from "./site";

/**
 * RSS feed logic for the theme.
 *
 * Post images are bundled by the *consuming site* (their hashed URLs only exist
 * in that site's build). The glob below is root-relative (`/src/content/blog`),
 * so even though it lives in the theme, Vite resolves it against the site's
 * project root — i.e. the site's own posts, matching the location that
 * `content.config.ts` already assumes. A site can still pass its own
 * `imageUrls` to override (e.g. non-standard content location).
 */
const blogImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/content/blog/**/*.{png,jpg,jpeg,gif,webp}",
  { eager: true },
);

// Keys come back as `/src/content/blog/...`; normalise to the `src/content/blog/...`
// form that `fixFeedImages` matches against rendered post HTML.
const defaultImageUrls = new Map(
  Object.entries(blogImages).map(([path, image]) => [
    path.replace(/^\//, ""),
    image.default.src,
  ]),
);

/** Strip markdown down to a short plain-text excerpt. */
export function excerpt(markdown = "", length = 140) {
  return markdown
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]:\s*\S+/g, "")
    .replace(/\[([^\]]+)\](?:\[[^\]]*\])?/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, length);
}

function absolutizeUrl(path: string, siteUrl: string) {
  return new URL(path, siteUrl).toString();
}

/**
 * Rewrite Astro's `__ASTRO_IMAGE_` placeholders in rendered post HTML into
 * absolute <img> tags, using the site-provided `imageUrls` map (content path
 * → built/hashed URL).
 */
export function fixFeedImages(
  html = "",
  postFilePath = "",
  imageUrls: Map<string, string>,
  siteUrl: string,
) {
  const postDir = postFilePath.replace(/\/[^/]+$/, "");

  return html.replace(
    /<img\s+__ASTRO_IMAGE_="([^"]+)"\s*>/g,
    (match, rawImageData) => {
      try {
        const imageData = JSON.parse(
          rawImageData
            .replace(/&quot;/g, '"')
            .replace(/&#x22;/g, '"')
            .replace(/&amp;/g, "&"),
        );
        const imagePath =
          `${postDir}/${imageData.src.replace(/^\.\//, "")}`.replace(
            /^.*src\/content\/blog\//,
            "src/content/blog/",
          );
        const src = imageUrls.get(imagePath);

        if (!src) return match;

        return `<img src="${absolutizeUrl(src, siteUrl)}" alt="${imageData.alt ?? ""}">`;
      } catch {
        return match;
      }
    },
  );
}

interface BlogRssOptions {
  context: APIContext;
  site: SiteConfig;
  /**
   * Content path → built image URL. Defaults to the theme's built-in glob of
   * `src/content/blog`; only pass this to override the content location.
   */
  imageUrls?: Map<string, string>;
}

/** Build the blog RSS response. Call this from the site's `rss.xml.ts`. */
export async function getBlogRss({
  context,
  site,
  imageUrls = defaultImageUrls,
}: BlogRssOptions) {
  const posts = await getBlogPosts();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: excerpt(post.body),
      pubDate: post.data.date,
      link: `/${getPostSlug(post)}/`,
      content: fixFeedImages(
        post.rendered?.html,
        post.filePath,
        imageUrls,
        site.siteUrl,
      ),
    })),
  });
}
