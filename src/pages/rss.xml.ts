import type { APIContext } from "astro";
import { getBlogRss } from "../lib/rss";
import { SITE } from "virtual:quaro-theme/config";

export const GET = (context: APIContext) => getBlogRss({ context, site: SITE });
