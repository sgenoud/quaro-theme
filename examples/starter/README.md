# quaro-blog-starter

A ready-to-run blog built on [quaro-theme](https://github.com/sgenoud/quaro-theme).
The theme provides the pages, layout, styles, and feed; this starter is just the
config, a sample post, and a place to override.

## Scaffold a new site

Copy this folder out of the theme repo (no git history) with
[degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sgenoud/quaro-theme/examples/starter my-blog
cd my-blog
npm install
npm run dev
```

## Make it yours

- **Identity** — edit `src/lib/site.ts` (title, author, description, URL, social
  links). It's passed to the theme in `astro.config.mjs`.
- **Posts** — add folders under `src/content/blog/<slug>/index.md`. See the
  included `hello-world` post for the frontmatter shape.
- **Colors / spacing** — edit `src/styles/overrides.css`; it redefines theme
  tokens and is loaded after them, so it wins. (Wired via the integration's
  `styles` option.)
- **A whole page** — drop a file in `src/pages/`; it overrides the theme's
  injected route of the same path. (That's exactly how `rss.xml.ts` works here.)

## What comes from the theme

`/`, `/[...slug]`, and `/404` are injected by the `quaro` integration — there
are no page files for them here. RSS and the per-post Open Graph card images
(`/og/<slug>.png`) ship as local endpoints (`src/pages/rss.xml.ts`,
`src/pages/og/[...slug].ts`) so the build works on any install; switch to the
injected versions by deleting those files and dropping the `pages` toggles in
`astro.config.mjs`.

Card images are on by default here (`cardImages: true`); the card art (title +
summary in HKGrotesk on a dark gradient) comes from the theme. Remove the flag,
the endpoint, and the `astro-og-canvas` dependency to turn them off.

## Fonts

The theme's default font family is `HKGrotesk`, loaded from `/fonts/*.woff2`.
Without those files the site falls back to the system sans-serif (which is
fine). To use HKGrotesk, drop the `.woff2` files in `public/fonts/`; to use your
own font, set `--font-sans` in `src/styles/overrides.css`.
