# quaro-theme

A reusable Astro blog theme, extracted from `blog.sgenoud.com`. It ships the
page shell, components, design tokens, and the content/RSS logic so a site only
provides its own config, posts, and assets — no forking.

Built for Astro 6 (content layer / glob loader). Sites install it as a
git-tagged dependency; no npm registry needed.

## Quick start (scaffold a new blog)

The fastest way to a working site is the starter under
[`examples/starter`](./examples/starter) — copy it out (no git history) with
[degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sgenoud/quaro-theme/examples/starter my-blog
cd my-blog
npm install
npm run dev
```

It comes pre-wired (integration, config, content collection, a sample post) and
runs immediately; edit `src/lib/site.ts` to make it yours. The rest of this
README covers wiring the theme into an existing site by hand.

## Install

Pin to a tag:

```bash
npm install github:<me>/quaro-theme#v0.1.0
```

Replace `<me>` with the GitHub owner and `v0.1.0` with the tag you want.

Import from the clean subpaths defined in `package.json`'s `exports`:

| Import                                 | What it is                                  |
| -------------------------------------- | ------------------------------------------- |
| `quaro-theme` (default)                | Astro integration that injects the pages    |
| `quaro-theme/layouts/BaseLayout.astro` | Page shell: SEO head, global styles, slots  |
| `quaro-theme/components/Header.astro`  | Default header (site title)                 |
| `quaro-theme/components/Footer.astro`  | Social-icon footer                          |
| `quaro-theme/components/Bio.astro`     | Author bio block                            |
| `quaro-theme/components/Icon.astro`    | Inline SVG icon                             |
| `quaro-theme/styles/tokens.css`        | Design tokens (CSS variables)               |
| `quaro-theme/lib/site`                 | `SiteConfig` type + `DEFAULT_SITE`          |
| `quaro-theme/lib/posts`                | `getBlogPosts`, `getPostSlug`, date helpers |
| `quaro-theme/lib/rss`                  | `getBlogRss`, `excerpt`                     |
| `quaro-theme/content.config`           | The `blog` collection schema + loader       |

## Wiring up a site

### 1. Site config

The theme is site-agnostic; everything site-specific is one object typed with
`SiteConfig`. Create it once and pass it to the integration (and to
`BaseLayout` directly if you write custom pages):

```ts
// site/src/lib/site.ts
import type { SiteConfig } from "quaro-theme/lib/site";

export const SITE: SiteConfig = {
  title: "My Blog",
  author: "Me",
  description: "My personal blog.",
  siteUrl: "https://example.com",
  logo: "/logo.png",
  social: {
    rss: "/rss.xml",
    github: "https://github.com/me",
  },
};
```

### 2. Content collection

Astro only reads `src/content.config.ts` from the site, so re-export the
theme's schema. Posts then live at `src/content/blog/<slug>/index.md`:

```ts
// site/src/content.config.ts
export { collections } from "quaro-theme/content.config";
```

### 3. Default pages (the integration)

Add the theme integration to `astro.config` and it injects the blog's default
routes — `/`, `/[...slug]`, `/404`, and `/rss.xml` — so a site needs **no page
files of its own**:

```js
// site/astro.config.mjs
import { defineConfig } from "astro/config";
import quaro from "quaro-theme";
import { SITE } from "./src/lib/site";

export default defineConfig({
  site: SITE.siteUrl,
  integrations: [quaro({ site: SITE })],
});
```

The injected pages read your config through a virtual module. For editor/types
support, add the reference to `src/env.d.ts`:

```ts
/// <reference types="quaro-theme/virtual" />
```

### 4. Overriding a page

A file in your own `src/pages/` takes precedence over the injected route of the
same path — drop one in to replace just that page. You can also disable an
injected default explicitly via the `pages` option (handy to silence
route-collision warnings):

```js
integrations: [quaro({ site: SITE, pages: { index: false } })],
```

A custom index, for example, built from the theme's pieces directly:

```astro
---
// site/src/pages/index.astro
import BaseLayout from 'quaro-theme/layouts/BaseLayout.astro';
import Bio from 'quaro-theme/components/Bio.astro';
import { getBlogPosts, getPostSlug, formatPostDate } from 'quaro-theme/lib/posts';
import { SITE } from '../lib/site';
import avatar from '../assets/profile-pic.jpg';

const posts = await getBlogPosts();
---
<BaseLayout site={SITE} title="All posts" home>
  <Bio author={SITE.author} image={avatar} />
  {posts.map((post) => (
    <div class="post-preview">
      <h3><a class="post-link" href={`/${getPostSlug(post)}/`}>{post.data.title}</a></h3>
      <small>{formatPostDate(post.data.date)}</small>
      <p>{post.data.summary}</p>
    </div>
  ))}
</BaseLayout>
```

### 5. RSS

`/rss.xml` is one of the injected routes, so by default there's nothing to do.
If you'd rather host it yourself — or your setup can't resolve the theme's
`@astrojs/rss` peer dependency through an injected route (e.g. a locally
symlinked theme) — disable it with `pages: { rss: false }` and add a one-line
endpoint:

```ts
// site/src/pages/rss.xml.ts
import type { APIContext } from "astro";
import { getBlogRss } from "quaro-theme/lib/rss";
import { SITE } from "../lib/site";

export const GET = (context: APIContext) => getBlogRss({ context, site: SITE });
```

`getBlogRss` globs post images itself (from the standard `src/content/blog`
location) and rewrites them to absolute URLs in the feed. If your posts live
elsewhere, build your own `Map` of `src/content/blog/...` → built image URL and
pass it as `imageUrls`.

### 6. Fonts

The default tokens use the `HKGrotesk` font family, loaded via `@font-face`
from `/fonts/*.woff2`. Either drop those files in the site's `public/fonts/`,
or override `--font-sans` (see below) to use your own.

## Overriding colors / spacing

Every visual value is a CSS variable in
[`src/styles/tokens.css`](./src/styles/tokens.css). Define an `overrides.css`
in your site that redefines just the variables you want:

```css
/* site/src/styles/overrides.css */
:root {
  --title-blue: #db2777;
  --content-max-width: 48rem;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

It must load **after** the theme's `tokens.css`. How depends on which pages you
use:

- **Injected pages (the integration).** Pass the file to the `styles` option;
  the injected pages import it after the tokens for you:

  ```js
  integrations: [quaro({ site: SITE, styles: ["/src/styles/overrides.css"] })],
  ```

- **Your own pages.** Import it after `BaseLayout` (which pulls in `tokens.css`),
  so it wins the cascade:

  ```astro
  ---
  import BaseLayout from 'quaro-theme/layouts/BaseLayout.astro';
  import '../styles/overrides.css'; // after the layout → overrides the tokens
  ---
  ```

## Overriding a region (header / footer)

`BaseLayout` exposes named `header` and `footer` slots that fall back to the
theme defaults. Pass your own markup to replace either region:

```astro
<BaseLayout site={SITE} title="Home">
  <MyHeader slot="header" />

  <p>Content…</p>

  <footer slot="footer">My custom footer</footer>
</BaseLayout>
```

Leave a slot empty to keep the theme's default (`Header` / `Footer`).

## Overriding a whole component

There's nothing to eject. If you don't want the theme's version of a component,
just don't import it — write your own and use it directly on the relevant
pages. The theme's components are defaults, not requirements.

## Versioning

- Releases are tagged `vX.Y.Z` (semver); sites pin to a tag.
- Every release is recorded in [`CHANGELOG.md`](./CHANGELOG.md).
- To upgrade, a site bumps the tag in its `npm install …#vX.Y.Z`.
