# Security Audit

## Status

No critical code-level security issues remain in the current repo state.

This audit covers the public Next.js API routes, client-side inputs that feed those routes, secrets handling in tracked files, and the new payments/insights surfaces. The app does not currently implement authenticated user accounts or per-user resource access, so authentication and authorization checks are not applicable to the existing route set.

## Route Review

| Route | User data / PII | Auth / Authz | Validation | Rate limiting | Current status |
| --- | --- | --- | --- | --- | --- |
| `GET /api/chat` | No | Not applicable: status endpoint only | Rejects unexpected query params | Added | Clean |
| `POST /api/chat` | User-supplied free text | Not applicable: no user account or resource lookup | Zod body schema, shared sanitization, client-side schema gate | Present | Clean |
| `GET /api/intake` | No | Not applicable: status endpoint only | Rejects unexpected query params | Added | Clean |
| `POST /api/intake` | Yes: name, email, phone, language, case summary | Not applicable: anonymous intake form, no stored user resource fetch | Zod body schema, honeypot, shared sanitization, client-side schema gate | Present | Clean |
| `GET /api/insights` | No | Not applicable: public read-only feed | Rejects unexpected query params | Present | Clean |

## Findings Fixed

1. Public API status endpoints were previously callable without any throttling. Rate limiting now applies to `GET /api/chat` and `GET /api/intake` in addition to the existing POST limits and insights feed throttling.
2. Public POST routes accepted browser-originated requests without explicit origin checks. `POST /api/chat` and `POST /api/intake` now reject untrusted `Origin` / `Referer` values and reject unexpected query parameters.
3. Frontend validation did not consistently reuse backend schemas before submission. The chat widget now validates messages with the shared Zod schema before sending, and the intake form now runs `intakeSchema.safeParse(...)` client-side before POSTing.
4. Input sanitization was inconsistent. Shared sanitization helpers now normalize chat and intake inputs before validation on both the frontend and backend, reducing control-character, angle-bracket, and malformed phone/email noise.
5. The dependency audit reported a vulnerable `next` version range. `npm audit fix` was run and the dependency tree now reports zero known vulnerabilities.
6. Live insights were silently disabled whenever the shared AI resolver picked OpenRouter (the default). Insights now use a dedicated direct-OpenAI client keyed solely off `OPENAI_API_KEY`, decoupled from the shared provider resolver.
7. The origin guard only trusted localhost + NEXT_PUBLIC_SITE_URL, which broke chat and intake forms on Vercel preview/staging deployments. The guard now also trusts `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, a configurable `TRUSTED_ORIGINS` allowlist, and same-deployment origins.
8. `vercel.json` was missing critical response headers: `Strict-Transport-Security` (HSTS with 2-year max-age and preload), `Referrer-Policy` (strict-origin-when-cross-origin), `Permissions-Policy` (deny camera/microphone/geolocation, allow payment on self), and `Content-Security-Policy` (restrictive policy covering script, style, font, image, and connect sources).
9. The FastAPI `POST /chat` error handler (`api/agents.py`) returned `str(error)` directly in the response payload, which could leak internal implementation details, API key prefixes, or stack traces to the client. The error is now logged server-side and only a generic fallback response is returned.
10. The root `middleware.ts` hardcoded its own `FALLBACK_CANONICAL_URL`, which would silently diverge from `src/config/site.ts`. It also applied HTTPS/host redirects on preview deployments, breaking QA. The middleware now returns `null` for non-production Vercel environments and removes the hardcoded fallback.
11. Duplicate/outdated audit files (`security.md`, `api_audit.md`) from an earlier simplified pass have been removed. `security_audit.md` is now the single source of truth.

## Secrets Review

Tracked-file secret scan for common key patterns returned no matches.

Notes:

- `.env.local` exists locally but is ignored by `.gitignore`, so it is not part of the tracked codebase.
- Provider and webhook configuration remain server-side via environment variables.
- Payment integrations are link-based client flows only; there is no server-side payment secret or card processing route in this repo.

## Authentication / Authorization Notes

- There is no user account system, session layer, or protected resource model in this codebase today.
- None of the audited routes fetch account-specific records or authorize access to per-user resources.
- If authenticated dashboards, client portals, or stored matter records are introduced later, route-level auth and resource-level authorization will become mandatory.

## Supabase / RLS

Supabase is not present in this repository.

Concrete checks:

- No `@supabase/*` dependencies were found in `package.json`.
- No `supabase/` directory, migrations, or client configuration were found in the repo.

Result:

- Supabase row-level security policies cannot be configured from this codebase because no Supabase integration exists here today.
- If Supabase is added later, RLS should be treated as a launch blocker for any table containing client data, intake records, payments, or PII.

## Residual Risk

- Shared rate limiting in production still depends on Upstash environment variables being configured; otherwise the app falls back to in-memory throttling.
- FastAPI agent mode is optional and environment-driven. If enabled in production, the shared secret and target base URL still need to be configured correctly outside the repo.
- Public anonymous intake and chat routes remain intentionally open to unauthenticated visitors; this is a product decision, not a code defect.
- Live insights require `OPENAI_API_KEY` regardless of the primary chat provider. If only `OPENROUTER_API_KEY` is set, the insights page will still serve static editorial data (graceful degradation, not a crash).

## Verification Performed

- `eslint` on changed security-relevant files: passed
- `next build`: passed
- `npm audit --omit=dev`: passed with `found 0 vulnerabilities`
- Tracked-file secret scan via `git ls-files | rg`: no matches

## Final Assessment

The repo is in a good code-level security state for its current anonymous lead-generation architecture. No critical vulnerabilities remain in the audited surfaces. External infrastructure tasks still matter for launch, but they are not unresolved code defects inside this repository.
