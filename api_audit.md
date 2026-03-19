# API Audit

Scope: routes that read or write user data, payment flows, or PII.

Status rule for this audit:

- `Yes` = explicit control exists
- `Public route` = anonymous public endpoint by product design, not a missing control
- `N/A` = not applicable for that route shape

This file is clean when there are no `No` or `Missing` statuses.

| Route | Data Surface | Auth | Access Check | Schema Validation |
|---|---|---|---|---|
| `POST /api/chat` | User-submitted chat content that may contain PII | Public route | Public route with trusted-origin checks, payload-size limits, and rate limiting | Yes: Zod body schema + Zod empty-query schema |
| `GET /api/chat` | Readiness metadata for public chat | Public route | Public route with rate limiting | Yes: Zod empty-query schema |
| `POST /api/intake` | Intake PII: name, email, phone, case summary, documents, consent | Public route | Public route with trusted-origin checks, payload-size limits, and rate limiting | Yes: Zod body schema + Zod empty-query schema |
| `GET /api/intake` | Intake readiness metadata | Public route | Public route with rate limiting | Yes: Zod empty-query schema |
| `GET /pay/[method]` | Payment handoff / hosted checkout redirect | Public route | Redirect target restricted to allowed payment methods and validated server-side provider hosts | Yes: Zod path-param schema + Zod empty-query schema |
| `POST /api/agents/chat` | User-submitted chat content proxied to FastAPI specialist agents | Yes: shared-secret service auth | Yes: request rejected unless `x-agent-shared-secret` matches | Yes: Pydantic body schema |

## Notes

- The public website does not have end-user accounts or session auth. For `chat`, `intake`, and `pay`, anonymous access is intentional product behavior, so those routes are marked `Public route`, not `No`.
- `POST /api/intake` adds origin checks, schema validation, body-size limits, rate limiting, signed webhook forwarding, and optional confirmation emails.
- `POST /api/chat` adds origin checks, schema validation, body-size limits, bounded context windows, and rate limiting.
- `GET /pay/[method]` no longer trusts raw client-side payment URLs. Redirects are validated against server-side configuration.
- The FastAPI specialist-agent route uses service-to-service shared-secret auth rather than end-user auth because it is an internal backend path.
