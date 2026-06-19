import { createBlogOgRoute } from "quaro-theme/lib/og";
import { SITE } from "../../lib/site";

// Per-post Open Graph cards at /og/<slug>.png. Local endpoint (like rss.xml.ts)
// so the dependency resolves regardless of how the theme is installed.
export const { getStaticPaths, GET } = await createBlogOgRoute(SITE);
