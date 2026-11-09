---
name: hardcore-app-audit
description: Evidence-based production-readiness audit for an app before it touches paying customers. Checks schema, auth, tenancy, data safety, security, compliance, infrastructure, reliability, observability, testing, billing, integrations, AI risk, UX, code quality, support, and ownership. Use when the user says hardcore app audit, audit this app before launch, is this production ready, is this vibe-coded app safe for customers, pre-launch audit, or invokes /hardcore-app-audit. Requires a codebase path or repository.
trigger: User wants a blunt, evidence-based audit of an application (often AI-generated or prototype-grade) before paying customers, launch, an enterprise sale, or a security review.
---

# Hardcore App Audit

## Purpose

Turn the "before it touches a paying customer" checklist into an audit procedure. Inspect the real system, demand evidence, rank what will hurt, and return a verdict the user can act on.

This is not a code review and not a penetration test. It is a production-readiness audit: breadth across everything that breaks when an app meets real customers, real data, real money, and real attackers.

The core rule:

> A checklist item is not passed because the app probably has it. It passes only when the auditor can point to code, configuration, test output, or an operating artifact. Missing evidence is `UNVERIFIED` or `FAIL`, never `PASS`.

## Usage

Trigger patterns:

- `/hardcore-app-audit /path/to/app`
- "hardcore audit this app"
- "is this vibe-coded app ready for paying customers?"
- "pre-launch audit"
- "production readiness audit"
- "what breaks when this gets real users?"
- "audit this before we demo it to an enterprise buyer"

Inputs:

- **Required:** a codebase path or repository. Do not audit from a description alone.
- **Optional:** running app URL, deployment environment, customer type, data classes (PII, PHI, card data), contractual claims, previous audit, deadline.
- **Optional scope:** auth only, tenancy only, billing only, AI features only. State the scope explicitly in the report.

If the user asks for a "quick check", run a high-risk subset and label coverage. Never imply a full audit from a partial pass.

## Workflow

### 0. Safety rules

- Audit read-only. Do not fix code during the audit unless the user asks for a separate remediation pass.
- Do not run destructive tests: delete, restore-overwrite, failover, migration rollback on live data, or load tests against production.
- Do not probe production without explicit permission. Prefer local, staging, or a disposable environment.
- If you find a live secret, report its type and location. Redact the value. Recommend rotation. Never paste it into the report, chat, or a command line.
- Treat any live production credential as an incident, not a finding to sit on.

### 1. Establish context and scope

Record:

- App purpose and stage (prototype, pilot, paid launch, enterprise).
- Stack, data stores, hosting, deployment model.
- Customer type (consumer, SMB, enterprise, regulated).
- Data classes: PII, PHI, card data, credentials, children's data, customer content.
- Revenue paths: signup, checkout, subscriptions, invoicing, metering.
- AI features: what the model receives, what it can do, where it runs.
- Compliance claims already made in contracts, marketing, or security questionnaires.
- Team size and who operates the system.

Infer from the repo where possible. Label assumptions. Ask only questions that block the audit.

### 2. Map the attack and failure surface

Build a one-page map before grading anything:

- Entry points: HTTP routes, GraphQL, websockets, CLI, webhooks, cron jobs, admin tools, file uploads, AI tool calls.
- Trust boundaries: browser to API, API to database, service to third party, app to AI provider, tenant to tenant, staff to customer data.
- Auth and session paths, including password reset, MFA, SSO, impersonation, API keys.
- Data stores, schemas, migrations, backups.
- Money paths and state transitions.
- Infrastructure, CI/CD, secrets, DNS, email.
- Tests, monitoring, runbooks, docs, support tooling.

List unknown areas as coverage gaps. Do not fill them with optimism.

### 3. Build the evidence ledger

Work through `references/audit-checklist.md` by domain. For every check record:

| Field | Value |
|-------|-------|
| Check ID | `A1`, `B2`, etc. |
| Status | `PASS`, `PARTIAL`, `FAIL`, `UNVERIFIED`, `N/A` |
| Evidence | `file:line`, config path, command output, artifact path, or interview |
| Confidence | `Confirmed`, `Likely`, `Unverified` |
| Notes | What the evidence proves and what it does not |

Status definitions:

- **PASS** — control exists, is enforced on all relevant paths, and has evidence.
- **PARTIAL** — control exists but is inconsistent, untested, unmonitored, or bypassable.
- **FAIL** — control is absent, disabled, or directly contradicted by the code/config.
- **UNVERIFIED** — cannot inspect or no evidence available. This is not a pass.
- **N/A** — does not apply. Record why.

Docs, comments, and marketing claims are not evidence. They are claims to verify.

### 4. Run baseline checks

Run every non-destructive check the stack supports and record the exact command and result:

- Test suite, lint, typecheck, build.
- Dependency audit and lockfile review.
- Secret scan over tracked files and build output.
- Route inventory versus auth middleware coverage.
- Schema and migration inspection.
- Config review: CORS, security headers, cookies, TLS, debug flags, environment separation.
- Client bundle scan for server-side keys or internal URLs.
- Backup, restore, monitoring, and alerting artifacts, if accessible.
- Search for the high-signal red flags below.

Do not install new tools into the audited project without permission. Use what is present, plus read-only inspection.

### 5. Grade findings

Each finding gets:

- ID, title, and domain.
- Severity: `P0` to `P3`.
- Confidence: `Confirmed`, `Likely`, or `Unverified`.
- Evidence: exact `file:line`, config path, or command output.
- Failure scenario: who does what, what breaks, what it costs.
- Fix and effort (`S`, `M`, `L`).
- Dependencies or sequencing notes.

Severity rubric:

| Severity | Meaning | Examples |
|----------|---------|----------|
| **P0 — Blocker** | Stop ship. Any customer touching this causes breach, loss, or legal exposure. | Auth bypass, IDOR, tenant data leak, privilege escalation, exposed production secret, unrecoverable data loss, untested backup with no restore, double charging, PHI/card data exposure, remote code execution, unrestricted file upload. |
| **P1 — High** | Paid launch blocker unless properly mitigated. | Missing MFA/SSO required by customer, weak login throttling, no audit trail, no monitoring or on-call on revenue paths, no rollback/zero-downtime, unsigned webhooks, missing idempotency, timezone or money bugs, no load test before launch. |
| **P2 — Medium** | Degrades reliability, security, or UX but is contained. | Missing exports, pagination edge cases, i18n gaps, dependency hygiene, docs gaps, admin/support tooling gaps. |
| **P3 — Low** | Hygiene and maintainability. | Dead code, oversized files, missing changelog, style issues. |

Rules:

- Severity is impact times likelihood, not code cleanliness.
- Do not inflate. `P0` means stop ship.
- Do not downgrade a finding because the fix is expensive.
- If a critical control cannot be inspected, keep it `UNVERIFIED` and surface it as a verdict risk.

### 6. Decide the verdict

Use one of three verdicts:

- **NOT READY** — any confirmed `P0`, or any unresolved `P1` in auth, money, tenancy, data durability, or contractual compliance.
- **CONDITIONAL** — no confirmed `P0`; remaining `P1`s have an owner, date, and compensating control; critical unknowns are explicitly listed. Safe only for a limited pilot.
- **READY FOR PAYING CUSTOMERS** — no open `P0` or `P1`; `P2`s are accepted with owner and date; operating evidence exists for backups and restores, monitoring and on-call, and every claimed compliance regime.

Do not produce a single score out of 100. It implies precision the evidence does not support. Use coverage, severity counts, and the verdict.

### 7. Write the report

Use this structure:

```markdown
# Hardcore App Audit — {app} — {date}

## Verdict
{NOT READY | CONDITIONAL | READY FOR PAYING CUSTOMERS}
{Two or three sentences: the single biggest reason and what must happen next.}

## Scope and assumptions
- Audited: {paths, environments, commit}
- Excluded: {paths, systems, environments}
- Assumed: {customer type, data classes, compliance claims}
- Could not verify: {artifacts, access, third parties}

## Top blockers
{Ordered P0/P1 list. One line each, with evidence and impact.}

## Domain scorecard
| Domain | PASS | PARTIAL | FAIL | UNVERIFIED | N/A |
|--------|------|---------|------|------------|-----|

## Findings
| ID | Sev | Confidence | Domain | Finding | Evidence | Failure scenario | Fix | Effort |
|----|-----|------------|--------|---------|----------|------------------|-----|--------|

## Remediation plan
### Stop ship — before any customer data
### Before paid launch
### Before enterprise or regulated customer
### Ongoing operations
{Each item: finding ID, action, owner role, verification evidence.}

## Staffing reality check
{Which gaps require a senior engineer, backend engineer, DevOps, security, QA, tech lead, architect, or on-call owner. Do not pretend a checklist closes these.}

## Coverage and honesty
{What was sampled versus exhaustive. What remains unknown. What would change the verdict.}
```

Keep the verdict in the first three lines. A founder should be able to read the top and know whether to ship.

### 8. Sequence remediation

Group fixes by gate:

- **Stop ship:** every confirmed `P0`. No customer, no production data, no demo with real records.
- **Before paid launch:** `P1` plus `P2` items on signup, checkout, auth, and data export.
- **Before enterprise or regulated customer:** SSO, SAML, SCIM, pen test, security questionnaire evidence, SOC 2/HIPAA/PCI scope, access reviews, DR testing, data residency.
- **Ongoing:** dependency upgrades, framework upgrades before end of security support, backup restore drills, access reviews, on-call, postmortems.

Order by risk reduction per unit of effort, but never hide a `P0` behind a larger project.

## Stage gates

Not every app needs every enterprise control. Use the customer and contract to decide, and record `N/A` with a reason.

- **Any real customer:** schema, auth, authorization, tenancy, server validation, secrets, backups, migrations, basic monitoring, basic tests, actionable errors.
- **Paying customers:** billing correctness, dunning, invoices, email deliverability, load testing, tested restore, on-call, rollback, feature flags, privacy/terms accuracy.
- **Enterprise buyer:** SSO, SAML, SCIM, audit trails, pen test, security questionnaire evidence, access reviews, DR plan, data residency, named security owner.
- **Regulated data:** HIPAA/BAAs, PCI scope, GDPR deletion, retention, data residency, auditor evidence.

## High-signal red flags in AI-built apps

Search for these first. Verify each one; do not assume every AI-built app has them.

- Server, service-role, or admin credentials in client bundles or `NEXT_PUBLIC_`/`VITE_` variables.
- Supabase RLS disabled or policies set to `true`; Firebase rules open.
- Auth checks only in the UI or router; API trusts the client.
- No migrations; schema changed by hand or ORM auto-sync left on in production.
- `Access-Control-Allow-Origin: *` combined with credentials.
- Webhooks with no signature verification.
- Model output passed to HTML, SQL, shell, or `eval`.
- AI agent with broad production credentials or irreversible tools.
- Money stored as floats or calculated only in the client.
- Timestamps stored as local strings.
- Unbounded queries, no pagination, `SELECT *` on growing tables.
- Catch-all error handling that swallows failures.
- Hallucinated or typosquatted packages, duplicate libraries, unused dependencies.
- Hardcoded localhost URLs, test keys, debug flags, or sample credentials.
- Duplicate models/tables per feature and dead code from abandoned attempts.
- Disabled TLS verification (`rejectUnauthorized: false`, `verify=False`).
- File uploads stored in a public webroot with executable content.
- Queries without a tenant filter.
- Admin impersonation without an audit trail.
- `TODO`, `FIXME`, or `HACK` comments around auth, payments, or validation.

## Guardrails

- Do not equate "AI wrote it" with "bad". Inspect the code.
- Do not claim certification. Say "evidence exists" or "not evidenced".
- Never fabricate file paths, line numbers, test results, or artifact contents.
- Do not pad the report with generic best practice. Tie every finding to this app.
- Do not run load tests, failover tests, restores, or destructive migrations against production without explicit approval and a safe plan.
- Do not expose secrets in the report, terminal output, or chat.
- Distinguish "not implemented" from "not observable from this repo".
- For large codebases, sample high-risk paths and state coverage. Do not claim exhaustive review.
- Every `FAIL` needs a failure scenario. Every `PASS` needs evidence.
- Never silently close a finding after a fix. Re-audit with evidence.

## Expected Outcome

A blunt, defensible verdict; a ranked list of blockers with `file:line` evidence; an honest list of what could not be verified; and a remediation sequence split by customer gate. Success is not a long report. It is knowing exactly what must be fixed before a paying customer, what can wait, and which claims are hopes rather than controls.

## Notes

- Checklist source: Mark Ajzenstadt (@mardehaym), "before it touches a paying customer", 15 October 2026. https://x.com/mardehaym/status/2110705357492203564
- Full categorized checklist: `references/audit-checklist.md`. Items marked `[baseline]` are minimal audit additions not present in the tweet.
- For deeper offensive testing, run the `security-audit` skill or commission a real penetration test. This skill does breadth and readiness, not exploit development.
- Related skill: `improve-system` for updating this skill after a session teaches something non-obvious.

## Lessons Log

| Date | Lesson | Change Made |
|------|--------|-------------|
| — | No lessons yet | — |
