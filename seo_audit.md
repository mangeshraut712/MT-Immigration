# SEO Audit

## Status

No critical code-level SEO blockers remain in the current repo state.

The repo now has canonical handling, structured data, machine-readable discovery files, updated metadata coverage, and better static caching. Several launch tasks requested by the checklist still require external platform access and cannot be verified from local code alone.

## Findings Fixed

1. Canonical and language alternates are now centralized and reused through `src/config/site.ts`, with `en-US` and `x-default` hreflang coverage for the current English site.
2. Subpages now have stronger page-level metadata coverage:
   - `/privacy`
   - `/terms`
   - `/brief-break`
   - `/insights`
   Each now includes canonical/open graph data beyond the root layout defaults.
3. Structured data is present:
   - site-wide organization / website / legal service schema in `src/components/seo/SiteStructuredData.tsx`
   - collection-page schema for `/insights`
4. `llms.txt` and `openapi.json` are now served as env-aware dynamic routes (`src/app/llms.txt/route.ts` and `src/app/openapi.json/route.ts`) so the canonical domain always matches `getSiteUrl()` and never drifts from the deployment host.
5. `robots.txt` no longer references a nonexistent `/private/` path.
6. `sitemap.xml` now includes `llms.txt` and `openapi.json` in addition to the main page set.
7. Canonical domain / HTTPS redirect handling is now enforced in production through `src/proxy.ts`, using `NEXT_PUBLIC_SITE_URL` as the source of truth and skipping preview deployments.
8. Static cache coverage improved:
   - long-lived asset caching already existed for brand assets
   - `_next/static` now also receives immutable caching headers via `vercel.json`
9. Internal linking improved with direct links between legal/support pages and primary commercial pages (`/`, `/insights`, `/#contact`).

## Current Code-Level SEO Surface

| Surface | Current state | Notes |
| --- | --- | --- |
| Root metadata | Present | Root layout sets metadata base, title template, description, keywords, canonical, robots, OG, Twitter |
| Subpage metadata | Present | `privacy`, `terms`, `brief-break`, `insights` now have stronger canonical / OG coverage |
| Sitemap | Present | Includes main public pages plus `llms.txt` and `openapi.json` |
| Robots | Present | Environment-aware indexability; no bogus private path |
| Structured data | Present | Organization / WebSite / LegalService + insights CollectionPage |
| Canonical redirect logic | Present | Production-only host / HTTPS redirect via `src/proxy.ts` |
| Hreflang | Present for current single-language site | `en-US` and `x-default`; no true multi-region page variants exist yet |
| AI discoverability | Present | Dynamic `llms.txt` and `openapi.json` routes, env-aware via `getSiteUrl()` |
| Static asset caching | Present | Brand assets + `_next/static` headers configured |

## Items That Cannot Be Verified From Local Code Alone

These remain external launch tasks, not repo-level fixes:

1. Sitemap submission in Google Search Console
2. Google Search Console ownership / connection status
3. Bing Webmaster Tools ownership / connection status
4. Requesting recrawl / validating indexation
5. Cloudflare SSL state
6. Cloudflare cache rules and edge behavior
7. Live redirect-chain verification on the production domain
8. Canonical domain correctness on the live domain if `NEXT_PUBLIC_SITE_URL` is not set to the intended production host

## Hreflang / Multi-Region Note

The current site is a single-language English site. There are no distinct country or language variants in the repo today, so only `en-US` and `x-default` alternates are appropriate. True multi-region hreflang coverage still requires actual region-specific pages or locale routes.

## Content / Internal Linking Notes

- The site now has internal cross-links between legal pages and primary commercial pages.
- `/insights` is linked from the main navigation and footer.
- The overall internal linking structure is sound for the current page count, but long-term SEO gains still depend on shipping more indexable, high-quality legal content over time.

## Verification Performed

- `next build`: passed
- `robots.txt` generation: present
- `sitemap.xml` generation: present
- `llms.txt`: dynamic route, canonical derived from env
- `openapi.json`: dynamic route, server URL derived from env
- Static asset cache headers in `vercel.json`: verified

## Final Assessment

The codebase is now in a strong pre-launch SEO state from a repository perspective. The remaining tasks are mostly platform operations and webmaster-console work that must be completed against the live production environment.
