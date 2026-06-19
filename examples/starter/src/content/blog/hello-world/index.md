---
title: Hello, world
slug: hello-world
summary: The first post in your new Quaro blog — delete it and start writing.
date: 2026-06-19
---

Welcome to your new blog! This post lives at
`src/content/blog/hello-world/index.md`. The folder name is just for you; the
URL comes from the `slug` in the frontmatter.

## Writing posts

Create a folder under `src/content/blog/` with an `index.md` and this
frontmatter:

- `title` — shown as the page heading and in the post list
- `slug` — the URL path (lowercase, no leading/trailing slash)
- `summary` — the blurb on the home page and in the RSS feed
- `date` — used for ordering and display
- `draft` — optional; set `true` to hide a post from the build

Co-locate images in the same folder and reference them relatively
(`![alt](./photo.jpg)`); they're optimized automatically and rewritten to
absolute URLs in the feed.

## Making it yours

Edit `src/lib/site.ts` for the title, author, and social links, and
`src/styles/overrides.css` to change colors and spacing.
