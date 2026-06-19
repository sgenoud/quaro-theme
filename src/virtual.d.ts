// Types for the virtual module the integration generates. Consuming sites can
// pick these up by adding to their `src/env.d.ts`:
//
//   /// <reference types="quaro-theme/virtual" />
declare module "virtual:quaro-theme/config" {
  import type { SiteConfig } from "quaro-theme/lib/site";
  export const SITE: SiteConfig;
}
