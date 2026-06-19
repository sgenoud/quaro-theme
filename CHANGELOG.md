# Changelog

All notable changes to this theme are documented here. This project follows
[Semantic Versioning](https://semver.org/); releases are tagged `vX.Y.Z`.

## [Unreleased]

## [0.1.0] - 2026-06-19

### Added

- Initial theme, extracted from `blog.sgenoud.com`.
- `package.json` with `exports` subpaths for the integration (default + `.`),
  `pages/`, `layouts/`, `components/`, `styles/`, `lib/`, `content.config`, and
  `virtual` types; `astro` (^6) peer dependency and an optional `@astrojs/rss`
  peer.
- `src/integration.ts` — Astro integration (default export) that injects the
  default pages (`/`, `/[...slug]`, `/404`, `/rss.xml`) and exposes the site
  config to them via a `virtual:quaro-theme/config` module. A `pages` option
  toggles individual defaults off; a site's own `src/pages/*` file overrides the
  injected route of the same path. A `styles` option loads override stylesheets
  after the theme tokens (served as a `virtual:quaro-theme/overrides.css` module
  the injected pages import), so a page-less site can still redefine tokens.
- `src/pages/{index,[...slug],404}.astro` and `src/pages/rss.xml.ts` — default
  page templates the integration injects, reading config from the virtual module.
- `src/virtual.d.ts` — types for the virtual modules (`quaro-theme/virtual`).
- `examples/starter/` — a ready-to-run starter site (degittable) that pre-wires
  the integration, site config, content collection, a sample post, an overrides
  stylesheet, and a local RSS endpoint.
- `src/styles/tokens.css` — design tokens (brand/accent colors, text colors,
  typography, type scale, vertical rhythm, layout) as CSS custom properties,
  reproducing the blog.sgenoud.com look.
- `src/layouts/BaseLayout.astro` — page shell ported from the blog's `Layout`:
  full SEO/OpenGraph/Twitter head driven by a `SiteConfig`, token-driven global
  styles, default content slot, and overridable `header` / `footer` slots.
- `src/components/Header.astro` — default header (home/inner site title).
- `src/components/Footer.astro` — social-icon footer; links injected via a
  `social` prop.
- `src/components/Bio.astro` — author bio; author/avatar/blurb injectable.
- `src/components/Icon.astro` — inline SVG icon (ported as-is).
- `src/lib/site.ts` — `SiteConfig`/`SocialLinks` types and `DEFAULT_SITE`,
  making the theme site-agnostic via injected config.
- `src/lib/posts.ts` — `getBlogPosts`, `getPostSlug`, `formatPostDate`
  (ported as-is).
- `src/lib/rss.ts` — `getBlogRss` + `excerpt`/`fixFeedImages`. Globs post images
  from `src/content/blog` itself (via a root-relative glob resolved against the
  consuming site), so a site's `rss.xml.ts` is a one-line `GET`; the `imageUrls`
  map is an optional override for non-standard content locations.
- `src/content.config.ts` — the `blog` collection schema + glob loader for sites
  to re-export.
- README documenting install, site wiring (config, content, pages, fonts), and
  the three override paths (tokens, slots, whole components).
