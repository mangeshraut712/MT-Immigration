# Security Policy

## Supported Scope

This repository includes:

- a public Next.js site
- server-side AI routes
- an optional FastAPI agents backend
- deploy and environment configuration for Vercel

Please report vulnerabilities involving authentication, secrets, API exposure, rate limiting, input validation, redirects, upload paths, or deployment configuration.

## Reporting a Vulnerability

Do not open a public GitHub issue for suspected security problems.

Send a private report with:

- a short description of the issue
- reproduction steps
- affected files or routes
- impact assessment
- any proof-of-concept details needed to validate the report

If email is available for the maintainer, use that channel. Otherwise open a private GitHub security advisory for the repository.

## Response Expectations

- initial triage acknowledgement: target within 3 business days
- status update after validation: target within 7 business days
- remediation timing depends on severity and deployment impact

## Disclosure Guidance

- avoid posting secrets, tokens, or live exploit details publicly
- rotate any exposed credentials immediately
- keep reports limited to the minimum data needed to verify the issue
