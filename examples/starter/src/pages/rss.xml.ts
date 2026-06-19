import type { APIContext } from "astro";
import { getBlogRss } from "quaro-theme/lib/rss";
import { SITE } from "../lib/site";

// Local RSS endpoint (the theme can also inject this — see astro.config).
export const GET = (context: APIContext) => getBlogRss({ context, site: SITE });
