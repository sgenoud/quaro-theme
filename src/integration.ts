import type { AstroIntegration } from "astro";
import { DEFAULT_SITE, type SiteConfig } from "./lib/site";

/**
 * Quaro theme integration.
 *
 * Injects the blog's default pages (`/`, `/[...slug]`, `/404`, `/rss.xml`) so a
 * consuming site gets a working blog with no page files of its own. The site's
 * config is exposed to those pages through a virtual module
 * (`virtual:quaro-theme/config`).
 *
 * Overriding: a file in the site's own `src/pages/` takes precedence over the
 * injected route of the same path, so dropping in `src/pages/index.astro`
 * replaces just that page. You can also disable an injected page explicitly via
 * the `pages` option (handy to silence route-collision warnings).
 *
 * Usage (site `astro.config`):
 *
 *   import quaro from 'quaro-theme';
 *   import { SITE } from './src/lib/site';
 *
 *   export default defineConfig({
 *     integrations: [quaro({ site: SITE })],
 *   });
 */
export interface QuaroOptions {
  /** Site identity passed to every default page. Defaults to blog.sgenoud.com. */
  site?: SiteConfig;
  /** Toggle individual default pages off (e.g. when you provide your own). */
  pages?: {
    index?: boolean;
    post?: boolean;
    notFound?: boolean;
    rss?: boolean;
  };
}

const VIRTUAL_ID = "virtual:quaro-theme/config";
const RESOLVED_VIRTUAL_ID = "\0" + VIRTUAL_ID;

export default function quaro(options: QuaroOptions = {}): AstroIntegration {
  const site = options.site ?? DEFAULT_SITE;
  const pages = {
    index: true,
    post: true,
    notFound: true,
    rss: true,
    ...options.pages,
  };

  return {
    name: "quaro-theme",
    hooks: {
      "astro:config:setup": ({ injectRoute, updateConfig }) => {
        // Expose the site config to the injected pages as a virtual module.
        updateConfig({
          vite: {
            plugins: [
              {
                name: "quaro-theme:virtual-config",
                resolveId(id) {
                  if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
                  return undefined;
                },
                load(id) {
                  if (id === RESOLVED_VIRTUAL_ID) {
                    return `export const SITE = ${JSON.stringify(site)};`;
                  }
                  return undefined;
                },
              },
            ],
          },
        });

        if (pages.index) {
          injectRoute({
            pattern: "/",
            entrypoint: "quaro-theme/pages/index.astro",
            prerender: true,
          });
        }
        if (pages.post) {
          injectRoute({
            pattern: "/[...slug]",
            entrypoint: "quaro-theme/pages/[...slug].astro",
            prerender: true,
          });
        }
        if (pages.notFound) {
          injectRoute({
            pattern: "/404",
            entrypoint: "quaro-theme/pages/404.astro",
            prerender: true,
          });
        }
        if (pages.rss) {
          injectRoute({
            pattern: "/rss.xml",
            entrypoint: "quaro-theme/pages/rss.xml.ts",
            prerender: true,
          });
        }
      },
    },
  };
}
