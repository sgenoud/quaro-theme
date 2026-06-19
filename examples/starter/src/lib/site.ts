import type { SiteConfig } from "quaro-theme/lib/site";

// Edit this — it's the only file most sites need to touch to make the theme
// their own. It's passed to the integration in `astro.config.mjs`.
export const SITE: SiteConfig = {
  title: "My Blog",
  author: "Your Name",
  description: "A personal blog built with the Quaro theme.",
  siteUrl: "https://example.com",
  logo: "/logo.png",
  social: {
    rss: "/rss.xml",
    github: "https://github.com/your-handle",
    // mastodon: 'https://your.instance/@you',
    // linkedIn: 'https://www.linkedin.com/in/you/',
  },
};
