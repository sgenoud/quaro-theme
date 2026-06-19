/**
 * Site configuration contract for the theme.
 *
 * The theme is site-agnostic: layouts/components take a `SiteConfig` so each
 * consuming site supplies its own identity, while `DEFAULT_SITE` reproduces
 * blog.sgenoud.com so the theme renders sensibly out of the box. A site
 * defines its own object (typed with `SiteConfig`) and passes it to
 * `BaseLayout`, `Footer`, etc.
 */

export interface SocialLinks {
  /** Path or URL to the RSS feed (e.g. "/rss.xml"). */
  rss?: string;
  mastodon?: string;
  github?: string;
  linkedIn?: string;
}

export interface SiteConfig {
  title: string;
  author: string;
  description: string;
  /** Absolute origin, used for canonical URLs and OG/Twitter images. */
  siteUrl: string;
  /** Path to the logo/OG image, resolved against `siteUrl`. */
  logo: string;
  /**
   * BCP 47 language tag (e.g. "en-US", "fr-FR"). Drives the document `lang`
   * attribute, the OpenGraph locale, and the locale used to format dates.
   * Defaults to "en-US" when omitted.
   */
  locale?: string;
  googleVerification?: string;
  social: SocialLinks;
}

export const DEFAULT_SITE: SiteConfig = {
  title: "Carrots",
  author: "Steve Genoud",
  description: "Carrots are good for your health.",
  siteUrl: "https://carrots.sgenoud.com",
  logo: "/logo.png",
  locale: "en-US",
  googleVerification: "C0iHGBvlb4LB3k_GdIP0LNDv75Llzb6Ic7QVYI8ZfTQ",
  social: {
    rss: "/rss.xml",
    mastodon: "https://toot.cafe/@stevegenoud",
    github: "https://github.com/sgenoud",
    linkedIn: "https://www.linkedin.com/in/stevegenoud/",
  },
};
