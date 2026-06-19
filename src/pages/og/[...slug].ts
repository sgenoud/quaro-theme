import { createBlogOgRoute } from "../../lib/og";
import { SITE } from "virtual:quaro-theme/config";

// Injected by the integration when the site sets `cardImages: true`. Generates
// the per-post Open Graph cards at /og/<slug>.png.
export const { getStaticPaths, GET } = await createBlogOgRoute(SITE);
