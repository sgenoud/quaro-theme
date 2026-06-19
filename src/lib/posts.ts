import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function getPostSlug(post: BlogPost) {
  return post.data.slug;
}

function assertUniquePostSlugs(posts: BlogPost[]) {
  const seen = new Map<string, BlogPost>();

  for (const post of posts) {
    const existing = seen.get(post.data.slug);

    if (existing) {
      throw new Error(
        `Duplicate blog slug "${post.data.slug}" found in ${existing.id} and ${post.id}`,
      );
    }

    seen.set(post.data.slug, post);
  }
}

export async function getBlogPosts() {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true);
  assertUniquePostSlugs(posts);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatPostDate(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Filename stem for a post's OG card. `astro-og-canvas` treats a dot in a route
 * key as a file extension, so flatten dots to keep slugs like
 * `use-popper.js-in-react` intact. Used by both the card route and the
 * `og:image` URL so they always match.
 */
export function ogImageSlug(slug: string) {
  return slug.replace(/\./g, "-");
}
