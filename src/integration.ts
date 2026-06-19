import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
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
    /** Per-post OG card route at `/og/[...slug]`. Only injected when the site
     *  config has `cardImages: true`. Disable when hosting it yourself. */
    og?: boolean;
  };
  /**
   * Extra stylesheet specifiers to load globally, after the theme's tokens —
   * the way a page-less (fully injected) site applies token overrides. Each
   * entry is resolved by Vite, so root-relative paths work, e.g.
   * `['/src/styles/overrides.css']`.
   */
  styles?: string[];
}

const CONFIG_ID = "virtual:quaro-theme/config";
const RESOLVED_CONFIG_ID = "\0" + CONFIG_ID;
// Note: keep the `.css` suffix so Vite treats the virtual module as a stylesheet.
const OVERRIDES_ID = "virtual:quaro-theme/overrides.css";
const RESOLVED_OVERRIDES_ID = "\0" + OVERRIDES_ID;

export default function quaro(options: QuaroOptions = {}): AstroIntegration {
  const site = options.site ?? DEFAULT_SITE;
  const pages = {
    index: true,
    post: true,
    notFound: true,
    rss: true,
    og: true,
    ...options.pages,
  };

  const styles = options.styles ?? [];

  return {
    name: "quaro-theme",
    hooks: {
      "astro:config:setup": ({ injectRoute, updateConfig, config }) => {
        // Read any site-provided override stylesheets up front. The injected
        // pages import `virtual:quaro-theme/overrides.css` after the theme's
        // tokens, so a fully-injected (page-less) site can still redefine
        // design tokens. Root-relative paths (`/src/...`) resolve from root.
        const overridesCss = styles
          .map((href) => {
            const abs = href.startsWith("/")
              ? fileURLToPath(new URL("." + href, config.root))
              : href;
            try {
              return readFileSync(abs, "utf8");
            } catch {
              return "";
            }
          })
          .join("\n");

        // Virtual modules: the site config (for pages) and the merged override
        // CSS (imported by pages after tokens.css).
        updateConfig({
          vite: {
            plugins: [
              {
                name: "quaro-theme:virtual",
                resolveId(id) {
                  if (id === CONFIG_ID) return RESOLVED_CONFIG_ID;
                  if (id === OVERRIDES_ID) return RESOLVED_OVERRIDES_ID;
                  return undefined;
                },
                load(id) {
                  if (id === RESOLVED_CONFIG_ID) {
                    return `export const SITE = ${JSON.stringify(site)};`;
                  }
                  if (id === RESOLVED_OVERRIDES_ID) {
                    return overridesCss;
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
        // Card images carry a heavy optional dep, so only inject the route when
        // the site actually opts in via `cardImages`.
        if (pages.og && site.cardImages) {
          injectRoute({
            pattern: "/og/[...slug]",
            entrypoint: "quaro-theme/pages/og/[...slug].ts",
            prerender: true,
          });
        }
      },
    },
  };
}
