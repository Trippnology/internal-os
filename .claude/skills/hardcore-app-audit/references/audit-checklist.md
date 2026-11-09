# Hardcore App Audit Checklist

Categorized production-readiness checks for `hardcore-app-audit`. Derived from Mark Ajzenstadt's "before it touches a paying customer" checklist (15 October 2026), with a small number of audit baselines marked `[baseline]`.

## How to use

For every item record:

- **Status:** `PASS`, `PARTIAL`, `FAIL`, `UNVERIFIED`, or `N/A`.
- **Evidence:** `file:line`, config path, command output, artifact path, or interview.
- **Confidence:** `Confirmed`, `Likely`, or `Unverified`.

Rules:

- `PASS` requires code, config, test output, or operating evidence. A README claim is not evidence.
- Process, compliance, backup, and operating controls need an artifact or operating record. Code alone cannot pass them.
- `PARTIAL` means the control exists but is inconsistent, untested, unmonitored, or bypassable.
- `UNVERIFIED` is not a pass. It is a verdict risk.
- `N/A` requires a written reason.
- Cite evidence for every non-`N/A` item.
- Mark `[baseline]` items as audit additions, not tweet requirements.

## A. Data model and persistence

- [ ] **A1 — Deliberate schema.** A human designed the entities, relationships, and constraints; the schema was not improvised table by table. Evidence: schema files, migrations, ERD, consistent naming, constraints.
- [ ] **A2 — Survives customer two.** The data model can absorb the second customer's "one small change" without a rewrite. Evidence: tenant-aware model, stable identifiers, extension points, migration history.
- [ ] **A3 — Money stored correctly.** Monetary values use integers in minor units or a proven decimal type, never floating point. Evidence: schema types, ORM mappings, payment code.
- [ ] **A4 — Timezones stored correctly.** Timestamps are UTC or timezone-aware, and display/reminders convert using the user's zone. Evidence: column types, default values, scheduling code, tests.
- [ ] **A5 — Soft deletes and recovery.** Accidental deletion is recoverable through soft deletes, trash, or a tested restore path; hard deletes are deliberate. Evidence: schema flags, delete handlers, restore UI or procedure.
- [ ] **A6 — Retention rules enforced.** Code deletes what the contract and policy say it will delete, on schedule. Evidence: retention jobs, policies, deletion logs.
- [ ] **A7 — Duplicate submission protection.** Repeated clicks or retries cannot create duplicate records or charges. Evidence: unique constraints, dedupe keys, submit handlers.
- [ ] **A8 — Idempotency keys.** Money-moving and state-changing operations accept idempotency keys and return the original result on retry. Evidence: payment calls, API handlers, stored keys.
- [ ] **A9 — Metering matches billing.** Usage metering reconciles with billed amounts to the cent. Evidence: metering pipeline, reconciliation query, sample invoices.
- [ ] **A10 — Indexes match real queries.** Indexes exist for production query patterns, not just primary keys. Evidence: query plans, schema indexes, slow-query logs.
- [ ] **A11 — Database constraints.** Foreign keys, uniqueness, nullability, and check constraints enforce invariants at the database. Evidence: schema, migration DDL.
- [ ] **A12 — Connection pooling.** Database access is pooled and bounded so a traffic spike cannot exhaust connections. Evidence: driver/pool config, serverless connection strategy, load test.

## B. Identity and sessions

- [ ] **B1 — Email normalization.** Login and signup handle plus signs, case differences, whitespace, and valid unusual addresses. Evidence: normalization code, tests.
- [ ] **B2 — Password reset links.** Reset tokens expire, work once, are bound to the user, and are invalidated by password change. Evidence: token storage, expiry logic, tests.
- [ ] **B3 — MFA and recovery.** MFA is available, and a user who loses their phone has a safe recovery path. Evidence: enrollment, recovery codes, support procedure.
- [ ] **B4 — Session lifetime and revocation.** Sessions time out, can be revoked individually, and "log out everywhere" kills all sessions for a user. Evidence: session store, revoke handlers, tests.
- [ ] **B5 — Login rate limits.** Login, reset, and MFA endpoints are rate-limited per account and per IP. Evidence: middleware, gateway rules, tests.
- [ ] **B6 — Balanced lockouts.** Lockouts stop password guessing without letting an attacker lock out a VIP before a board meeting. Evidence: thresholds, unlock path, alerting.
- [ ] **B7 — Password hashing.** Passwords use a current adaptive hash (Argon2id, bcrypt, scrypt) with sane parameters. Evidence: hashing code, stored format. `[baseline]`
- [ ] **B8 — Session cookie security.** Cookies are `HttpOnly`, `Secure`, `SameSite`, scoped, and rotated on privilege change. Evidence: cookie config, login code. `[baseline]`
- [ ] **B9 — SSO.** Enterprise SSO is supported when a customer requires it. Evidence: provider config, login flow, tenant-level enforcement.
- [ ] **B10 — SAML.** SAML is supported for customers whose IT team does not accept magic links. Evidence: SAML config, metadata, tested login.
- [ ] **B11 — SCIM and offboarding.** A fired employee loses access when IT offboards them, through SCIM or an equivalent deprovisioning path. Evidence: SCIM endpoint, sync logs, deactivation tests.
- [ ] **B12 — Staff and admin MFA.** Privileged accounts require MFA and cannot bypass it. Evidence: role policy, identity provider rules. `[baseline]`

## C. Authorization, tenancy, and admin access

- [ ] **C1 — Server-side authorization.** Every route and action enforces authorization on the server, not only in the UI. Evidence: middleware, handler checks, route inventory versus policy.
- [ ] **C2 — Object-level authorization.** User A cannot read user B's data by changing an ID in the URL or request body. Evidence: ownership checks, tests for IDOR.
- [ ] **C3 — Tenant isolation.** Tenant identity is enforced in queries, writes, jobs, caches, and unique constraints; one customer's bug cannot expose another customer's records. Evidence: tenant scoping layer, schema keys, cross-tenant tests.
- [ ] **C4 — Roles and permissions.** Permissions are finer than "admin" and "everyone else", and checks are consistent across API, jobs, and UI. Evidence: role model, policy definitions, tests.
- [ ] **C5 — Audited impersonation.** Support can "log in as this user" only with authorization, and every use is recorded. Evidence: impersonation flow, audit entries, alerts.
- [ ] **C6 — Least privilege.** Staff, services, database users, and AI agents get the minimum access needed, including production credentials. Evidence: IAM policies, roles, scoped tokens.
- [ ] **C7 — Access reviews.** Someone reviews access quarterly and signs off; stale access is removed. Evidence: review record, ticket history, sign-off artifact.
- [ ] **C8 — Audit trail.** Sensitive records log who viewed and changed them, not only writes, with timestamps and actor identity. Evidence: audit schema, event coverage, retention.

## D. Migrations, backups, and recovery

- [ ] **D1 — Forward and rollback migrations.** Every migration can run forward and has a tested rollback or compensating path. Evidence: migration files, rollback tests, release notes.
- [ ] **D2 — Safe migration locking.** Migrations avoid locking the main table during busy hours; large changes use online or staged techniques. Evidence: migration SQL, lock strategy, runbook.
- [ ] **D3 — Nightly backups.** Backups run automatically and cover every durable store. Evidence: backup config, schedules, success logs.
- [ ] **D4 — Tested restore.** A restore from backup has actually been performed and verified, not merely configured. Evidence: restore log, checksum or row-count verification, post-restore test.
- [ ] **D5 — Point-in-time recovery.** The database can recover to a moment before an accidental `DELETE` without a `WHERE`. Evidence: PITR config, retention window, restore drill.
- [ ] **D6 — Live migration safety.** A migration on a live database can run without losing rows or taking the app down. Evidence: dry run, backfill plan, verification queries.
- [ ] **D7 — Disaster recovery plan.** A written DR plan exists and has been tested within the last year. Evidence: plan document, test record, named owner.
- [ ] **D8 — Backup isolation.** Backups are encrypted, access-controlled, and isolated from production credentials, ideally immutable. Evidence: bucket policy, encryption, separate account. `[baseline]`
- [ ] **D9 — Recovery targets.** RTO and RPO are defined, match the contract, and are demonstrated by a drill. Evidence: documented targets, drill timing. `[baseline]`

## E. Validation, i18n, and money correctness

- [ ] **E1 — Server-side validation.** Every field is validated on the server, not just in the form; the API rejects invalid types, lengths, and values. Evidence: validators, schemas, tests.
- [ ] **E2 — Apostrophes in names.** Customers with an apostrophe in their last name can sign up, pay, and receive email. Evidence: encoding, tests, sample records.
- [ ] **E3 — Unicode everywhere.** Emoji, accents, and right-to-left text survive every field, export, email, and PDF. Evidence: column charset, encoding headers, tests.
- [ ] **E4 — Currency, rounding, and tax.** Each market's currency, rounding, and tax rules are implemented and tested. Evidence: pricing tables, tax provider, rounding tests.
- [ ] **E5 — Pagination at scale.** Pagination works on page 400 and does not degrade or skip rows under writes. Evidence: keyset pagination or stable ordering, load test.
- [ ] **E6 — Exports.** Customers can export their data in a usable format. Evidence: export endpoint, file format, large-export test.
- [ ] **E7 — Legacy imports.** Imports survive old CSV encodings, delimiters, quoted fields, and malformed rows. Evidence: parser, fixtures, error report.
- [ ] **E8 — Safe numeric boundaries.** Quantities, percentages, and totals handle zero, negatives, maxima, and rounding without overflow or drift. Evidence: tests, constraints. `[baseline]`

## F. Security and secrets

- [ ] **F1 — Secrets out of code.** No secrets in source, repo history, client bundles, logs, or AI chat history. Evidence: secret scan, history scan, bundle scan.
- [ ] **F2 — Exposed keys rotated.** Every key that was ever pasted into a config file, chat, or commit is rotated and revoked. Evidence: rotation log, provider key list.
- [ ] **F3 — Packages are real and intended.** Every dependency exists, is the intended package, and was not hallucinated or typosquatted. Evidence: lockfile review, registry metadata, allowlist.
- [ ] **F4 — Dependency scanning.** Dependencies are scanned for known vulnerabilities on a schedule. Evidence: scanner config, CI output, triage record.
- [ ] **F5 — Input sanitization.** User input is sanitized or escaped at every sink: HTML, SQL, shell, templates, logs, filenames. Evidence: sink inventory, escaping, tests.
- [ ] **F6 — OWASP coverage.** SQL injection, XSS, CSRF, SSRF, path traversal, deserialization, and the rest of the OWASP list are addressed. Evidence: code review, scanner output, tests.
- [ ] **F7 — File uploads.** Uploads are size-limited, type-checked, malware-scanned where appropriate, and stored where they cannot execute. Evidence: upload handler, storage policy, scanner.
- [ ] **F8 — Restrictive CORS.** CORS allows only known origins and does not combine wildcard origins with credentials. Evidence: CORS config, preflight tests.
- [ ] **F9 — Security headers.** CSP, HSTS, `X-Content-Type-Options`, frame protections, and referrer policy are set on responses. Evidence: header config, response inspection.
- [ ] **F10 — Encryption.** Data is encrypted in transit and at rest, including backups and object storage. Evidence: TLS config, storage encryption, database encryption.
- [ ] **F11 — Logs exclude secrets.** Logs record who did what without recording passwords, tokens, card numbers, or full PII. Evidence: logger config, redaction rules, sample logs.
- [ ] **F12 — TLS verification enabled.** Outbound clients verify certificates; no `rejectUnauthorized: false` or `verify=False` in production. Evidence: client config, search results. `[baseline]`
- [ ] **F13 — Debug off in production.** Debug pages, stack traces, verbose errors, and development endpoints are disabled in production. Evidence: env config, response inspection. `[baseline]`
- [ ] **F14 — SSRF protection.** URL-fetching features restrict schemes, hosts, and internal networks. Evidence: allowlist, resolver checks. `[baseline]`

## G. Compliance and privacy

- [ ] **G1 — SOC 2.** SOC 2 means policies, evidence, and an auditor, not a checkbox. Evidence: report, policy set, control evidence.
- [ ] **G2 — HIPAA.** HIPAA controls apply the moment a single patient record touches the system. Evidence: risk assessment, safeguards, BAAs, audit logs.
- [ ] **G3 — BAAs.** A BAA exists with every vendor that touches protected data, including the AI model provider. Evidence: signed agreements, vendor list.
- [ ] **G4 — PCI scope.** Card numbers are kept out of the database and scope is minimized through a tokenizing provider. Evidence: payment flow, data model, SAQ or scope diagram.
- [ ] **G5 — GDPR deletion.** Deletion requests reach every table, backup, log, cache, and third party that holds the data. Evidence: deletion runbook, coverage map, test record.
- [ ] **G6 — Data residency.** Data stays in the region the contract requires, including backups, logs, and AI processing. Evidence: region config, subprocessor list.
- [ ] **G7 — Security questionnaire evidence.** Answers to enterprise questionnaires are backed by evidence, not aspirations. Evidence: questionnaire file, control mapping.
- [ ] **G8 — Penetration test.** A penetration test is completed before the enterprise customer's security team runs their own. Evidence: report, remediation record.
- [ ] **G9 — Vulnerability disclosure.** A stranger can report a vulnerability through a published process with a response commitment. Evidence: security page, inbox, policy.
- [ ] **G10 — Terms and privacy match code.** Published terms and privacy policy accurately describe what the code collects, stores, shares, and deletes. Evidence: policy review against data map.

## H. Infrastructure and deployment

- [ ] **H1 — Environment parity.** Dev, staging, and production use matching runtime versions, services, and configuration shapes. Evidence: IaC, version pins, config diff.
- [ ] **H2 — Infrastructure as code.** Infrastructure lives in code, not one person's memory or a hand-built console. Evidence: Terraform, Pulumi, CloudFormation, Ansible.
- [ ] **H3 — Tests gate deploys.** The deploy pipeline runs tests, lint, and build checks before anything reaches customers. Evidence: CI config, recent pipeline runs.
- [ ] **H4 — One-click rollback.** A bad deploy can be rolled back quickly and safely. Evidence: rollback command, release history, drill.
- [ ] **H5 — Zero-downtime deploys.** Deploys do not require a maintenance window. Evidence: health checks, rolling/blue-green strategy, deploy log.
- [ ] **H6 — Feature flags.** Code can ship without the feature being visible. Evidence: flag provider, kill switch, flag cleanup.
- [ ] **H7 — Autoscaling.** Capacity scales for the Monday morning spike or is explicitly provisioned for peak. Evidence: autoscaling policy, load test.
- [ ] **H8 — CDN.** Static assets and cacheable responses are served close to users. Evidence: CDN config, cache headers, regional timing.
- [ ] **H9 — DNS and certificates.** DNS, SSL certificates, and renewals are automated and monitored; nothing expires on a Sunday. Evidence: registrar config, ACME renewal, expiry alerts.
- [ ] **H10 — Cost alerts.** Spend anomalies alert a human the same day, not on the invoice. Evidence: budget alerts, anomaly detection, threshold.
- [ ] **H11 — Second region.** A second region exists if the contract promises uptime one region cannot deliver. Evidence: failover architecture, drill record.
- [ ] **H12 — Environment isolation.** Production secrets, data, and credentials are separate from staging and development. Evidence: secret stores, project boundaries. `[baseline]`
- [ ] **H13 — Production access control.** Deploy and console access is limited, audited, and revocable. Evidence: IAM, SSO, audit log. `[baseline]`
- [ ] **H14 — Storage lifecycle.** Temporary files, old exports, and stale uploads expire so the company stops paying to keep 2021's temp files. Evidence: bucket lifecycle rules, cleanup jobs, storage report.

## I. Reliability and background jobs

- [ ] **I1 — Job queues.** Slow work runs in background queues instead of freezing the request. Evidence: queue config, worker code, timeout policy.
- [ ] **I2 — Retries with backoff.** Flaky external calls retry with exponential backoff and jitter, with a bounded attempt count. Evidence: retry policy, tests.
- [ ] **I3 — Dead-letter queue.** Jobs that exhaust retries land in a DLQ that someone monitors. Evidence: DLQ config, alert, replay procedure.
- [ ] **I4 — Single cron execution.** Cron jobs do not run twice when a second server appears, through locking or idempotency. Evidence: scheduler config, lock implementation.
- [ ] **I5 — Cache invalidation.** Cached data is cleared or versioned when the underlying data changes. Evidence: invalidation hooks, TTL strategy, stale-read tests.
- [ ] **I6 — External call timeouts.** Every outbound call has a timeout and a failure path. Evidence: client config, timeout values. `[baseline]`
- [ ] **I7 — Job idempotency.** Replayed jobs do not duplicate side effects. Evidence: idempotency keys, dedupe store. `[baseline]`

## J. Observability and incident response

- [ ] **J1 — Structured logs.** Logs are structured and searchable at 3am across services and requests. Evidence: logger config, correlation IDs, query example.
- [ ] **J2 — Error tracking.** Errors are grouped, deduplicated, and assigned, not sent as 4,000 separate emails. Evidence: Sentry or equivalent, grouping rules.
- [ ] **J3 — External uptime checks.** Uptime is checked from outside your own network. Evidence: monitor config, alert routing, status history.
- [ ] **J4 — Actionable alerts.** Alerts page a human and are tuned until they stop paging for noise. Evidence: alert rules, paging history, tuning record.
- [ ] **J5 — Dashboards.** Latency, error rate, throughput, queue depth, and saturation are visible. Evidence: dashboard links, panels, baseline values.
- [ ] **J6 — Tracing.** A slow request can be traced across every service it touches. Evidence: tracing config, sample trace.
- [ ] **J7 — On-call rotation.** An on-call rotation exists and a person actually picks up. Evidence: schedule, escalation policy, page history.
- [ ] **J8 — Runbooks.** The person on call knows what "queue depth critical" means and what to do. Evidence: runbook per alert, last review date.
- [ ] **J9 — Postmortems.** Incidents produce postmortems that change systems, tests, or processes. Evidence: postmortem log, action items, follow-through.
- [ ] **J10 — Status page.** Customers can check status before emailing support. Evidence: status page, update procedure.
- [ ] **J11 — Stolen device plan.** There is a plan for a laptop with production access getting stolen: revoke, rotate, notify, investigate. Evidence: incident runbook, drill.
- [ ] **J12 — Security event alerts.** Failed logins, privilege changes, key creation, and admin actions alert someone. Evidence: detection rules, alert routing. `[baseline]`
- [ ] **J13 — Audit log retention.** Audit and security logs are retained, protected from tampering, and searchable. Evidence: retention policy, storage controls. `[baseline]`

## K. Testing and QA

- [ ] **K1 — Unit tests.** Tests cover business logic and are written by someone who knows what the logic should do. Evidence: test suite, coverage of money/auth logic, meaningful assertions.
- [ ] **K2 — Integration tests.** Every third-party API dependency has an integration test or contract check. Evidence: test files, mocked and live modes.
- [ ] **K3 — End-to-end tests.** Signup, checkout, and other revenue flows have E2E coverage. Evidence: E2E suite, CI run.
- [ ] **K4 — Load testing.** Load testing happens before the launch email goes out. Evidence: test plan, results, capacity decision.
- [ ] **K5 — Production-like test data.** Test data resembles production without containing production data. Evidence: fixtures, anonymization, no live PII.
- [ ] **K6 — Regression tests.** Fixing bug 41 cannot silently bring back bug 12. Evidence: regression tests, issue links.
- [ ] **K7 — Old hardware testing.** The app works on the five-year-old laptop a big customer's ops team still uses. Evidence: browser/device matrix, test record.
- [ ] **K8 — Negative auth tests.** Tests prove user A cannot read user B's data and non-admins cannot reach admin actions. Evidence: authorization test suite. `[baseline]`

## L. Billing and revenue

- [ ] **L1 — Subscription lifecycle.** Upgrades, downgrades, cancellations, and proration behave correctly and are tested. Evidence: billing code, test cases, sample invoices.
- [ ] **L2 — Dunning.** Failed payments retry and trigger dunning emails on a sensible schedule. Evidence: retry policy, email sequence, state machine.
- [ ] **L3 — PO invoices.** Invoices carry the customer's PO number and whatever procurement requires. Evidence: invoice template, sample.
- [ ] **L4 — Sales tax and VAT.** Tax is calculated, collected, and reported for every jurisdiction sold into. Evidence: tax provider, registrations, reports.
- [ ] **L5 — Refunds and credits.** Refunds, credits, and partial refunds are supported and reconcile. Evidence: refund flow, ledger entries.
- [ ] **L6 — Custom annual contracts.** Annual contracts with custom terms fit the billing logic or have a documented manual path. Evidence: contract examples, billing mapping.
- [ ] **L7 — Finance reconciliation.** Revenue reports can be reconciled by finance. Evidence: report export, ledger tie-out.
- [ ] **L8 — Billing audit trail.** Invoices and ledger entries are immutable or versioned, with an audit trail. Evidence: schema, correction process. `[baseline]`

## M. APIs, integrations, and webhooks

- [ ] **M1 — Webhook signatures.** Incoming webhooks verify signatures and reject replays. Evidence: verification code, timestamp tolerance, tests.
- [ ] **M2 — Webhook retries and logs.** Outgoing webhooks retry with backoff and keep a delivery log. Evidence: retry policy, delivery log, replay tool.
- [ ] **M3 — Versioned API.** The API is versioned so changes do not break customer integrations. Evidence: version scheme, deprecation policy.
- [ ] **M4 — API key lifecycle.** Customers can create, scope, rotate, and revoke API keys. Evidence: key management UI/API, hashed storage.
- [ ] **M5 — API rate limits.** Limits protect the service without blocking legitimate integrations. Evidence: gateway rules, per-key quotas, 429 behavior.
- [ ] **M6 — Third-party change plan.** There is a plan for a third-party API changing its response format without notice. Evidence: contract tests, fallback, monitoring.
- [ ] **M7 — OAuth refresh.** OAuth tokens refresh before expiry, and refresh failure is handled. Evidence: refresh logic, expiry tests.
- [ ] **M8 — Integration sandbox.** Customers can test their integration in a sandbox. Evidence: sandbox environment, test keys, docs.

## N. AI-specific risk

- [ ] **N1 — Prompt injection.** Every field that reaches the model is treated as untrusted; tool use is constrained. Evidence: input handling, system prompt, tool permissions, tests.
- [ ] **N2 — Sensitive data in prompts.** Customer and patient data stays out of prompts that leave the network or are retained by a provider. Evidence: data flow, provider terms, redaction.
- [ ] **N3 — Spend caps.** A per-customer or per-tenant model spend cap prevents one heavy user from running up the bill. Evidence: quota config, enforcement, alerts.
- [ ] **N4 — Evals.** Evals detect when a model update makes answers worse. Evidence: eval suite, baseline, CI or release gate.
- [ ] **N5 — Provider fallback.** There is a fallback for the afternoon the model provider goes down. Evidence: secondary provider or degraded mode, failover test.
- [ ] **N6 — Model deprecation plan.** There is a migration plan for the day the model is deprecated. Evidence: model inventory, abstraction layer, migration note.
- [ ] **N7 — Prompt and output logs.** Logs exist for debugging but exclude data you are not allowed to keep. Evidence: logging config, retention, redaction.
- [ ] **N8 — Human approval.** Anything the AI does that cannot be undone has a human approval step. Evidence: approval flow, audit trail.
- [ ] **N9 — Output validation.** Model output is schema-validated and tool calls are allowlisted; output is never trusted as code, SQL, HTML, or shell. Evidence: validators, tool policy. `[baseline]`
- [ ] **N10 — Model and prompt versioning.** Model versions and prompts are pinned, reviewed, and rollback-capable. Evidence: config, change log. `[baseline]`

## O. UX and accessibility

- [ ] **O1 — Low-bandwidth performance.** Pages load on hotel wifi and mid-range mobile connections. Evidence: Lighthouse or WebPageTest on throttled profile, bundle size.
- [ ] **O2 — Screen states.** Every screen has empty, loading, and error states. Evidence: component inventory, screenshots, tests.
- [ ] **O3 — Actionable errors.** Error messages tell the customer what to do instead of "something went wrong". Evidence: error copy, support ticket themes.
- [ ] **O4 — Form preservation.** Forms keep what people typed when one field fails validation. Evidence: form handler, test.
- [ ] **O5 — Undo.** Destructive actions have undo or a confirmation path proportional to the risk. Evidence: UI flow, restore behavior.
- [ ] **O6 — Keyboard and screen reader.** Keyboard navigation and screen reader support work on core flows. Evidence: accessibility audit, manual test.
- [ ] **O7 — Locale formatting.** Translations, dates, numbers, and currency are formatted for each locale. Evidence: i18n config, locale tests.
- [ ] **O8 — Back button behavior.** The back button does what people expect and does not lose work silently. Evidence: router behavior, manual test.
- [ ] **O9 — Accessibility compliance.** The enterprise contract's accessibility standard is met, with evidence (WCAG audit, VPAT, or equivalent). Evidence: audit report, remediation list.

## P. Email and notifications

- [ ] **P1 — SPF, DKIM, DMARC.** All three are configured and passing so password resets do not land in spam. Evidence: DNS records, authentication results.
- [ ] **P2 — Bounce and complaint handling.** Hard bounces and complaints are processed and suppress future sends. Evidence: provider webhook, suppression list.
- [ ] **P3 — Email rendering.** Emails render in every mail client customers use, including Outlook and mobile. Evidence: rendering tests, Litmus or manual matrix.
- [ ] **P4 — Notification preferences.** People can turn notifications off without losing essential account mail. Evidence: preference center, unsubscribe handling.

## Q. Code quality, process, and documentation

- [ ] **Q1 — Readable code.** A human can read and change the code without reverse-engineering it. Evidence: naming, structure, comments where needed, review sample.
- [ ] **Q2 — Code review.** Every change is reviewed before merge. Evidence: branch protection, review history.
- [ ] **Q3 — Branching strategy.** Two people can work without overwriting each other. Evidence: branch model, merge policy.
- [ ] **Q4 — Monthly dependency upgrades.** Dependencies are upgraded monthly; the project is never two major versions behind. Evidence: upgrade log, lockfile age.
- [ ] **Q5 — Framework upgrades.** Frameworks are upgraded before the old version stops receiving security patches. Evidence: version support dates, upgrade plan.
- [ ] **Q6 — Dead code removed.** Abandoned AI attempts and unused code are deleted. Evidence: dead-code scan, unused exports.
- [ ] **Q7 — No monster files.** The 2,000-line file the AI kept appending to is split by responsibility. Evidence: file sizes, module boundaries.
- [ ] **Q8 — Architecture decisions recorded.** Decisions have written reasons, alternatives, and consequences (ADR or equivalent). Evidence: decision log.
- [ ] **Q9 — Fast local setup.** A README gets a new engineer running locally in under an hour. Evidence: README, timed trial.
- [ ] **Q10 — Handover documentation.** Docs exist for whoever inherits the system. Evidence: architecture, operations, data flow, runbooks.
- [ ] **Q11 — Customer changelog.** Customers can read what changed. Evidence: changelog page, release notes.
- [ ] **Q12 — Company ownership.** Every account, domain, repo, and billing relationship is in the company's name, not the prototype builder's. Evidence: ownership inventory, transfer records.
- [ ] **Q13 — Bus factor above one.** More than one person can operate and change the system. Evidence: access list, runbook coverage, handover test.

## R. Operations and support tooling

- [ ] **R1 — Admin panel.** Ops has a safe way to inspect and correct data without direct database access. Evidence: admin UI, permission model, audit log.
- [ ] **R2 — Support tooling.** Customer success can answer common questions without pinging engineering. Evidence: support console, macros, read-only views.
- [ ] **R3 — Safe support actions.** Support can perform common fixes through scoped tools, not shared credentials or raw SQL. Evidence: tool permissions, audit trail. `[baseline]`

## S. People and staffing reality

These are not code checks. Mark `PASS` only with named coverage, role assignment, or an operating record. A checklist does not replace these roles.

- [ ] **S1 — Senior engineer review.** A senior engineer reads every line the AI wrote before it ships. Evidence: review record, named owner.
- [ ] **S2 — Backend ownership of the data model.** A backend engineer designs and owns the data model before the second customer breaks it. Evidence: owner, schema review.
- [ ] **S3 — Regression control.** A senior engineer can explain why the AI's fix for one bug created two new ones and prevent the loop. Evidence: incident history, review process.
- [ ] **S4 — DevOps ownership.** Deploys, rollbacks, servers, and the cloud bill have an owner. Evidence: named role, on-call schedule.
- [ ] **S5 — On-call coverage.** Someone answers the page at 3am when payments stop. Evidence: rotation, escalation policy, page history.
- [ ] **S6 — Security patching.** Someone patches the framework the week a vulnerability goes public. Evidence: patch SLA, advisory subscription.
- [ ] **S7 — Audit walkthrough.** Security and compliance can walk an auditor through how patient data moves. Evidence: data map, named owner, prior audit.
- [ ] **S8 — Independent QA.** Someone tests what the AI says it tested. Evidence: QA sign-off, independent test run.
- [ ] **S9 — Live migration expertise.** A backend engineer can run a migration on a live database without losing a row. Evidence: drill record, named owner.
- [ ] **S10 — Technical veto.** A tech lead can say no to the feature that breaks three others. Evidence: decision process, authority.
- [ ] **S11 — Architecture ownership.** An architect turns "works on my laptop" into "works for every customer at once". Evidence: design review, scale test.
- [ ] **S12 — Debugging fallback.** A senior engineer can debug the code when the AI that wrote it cannot. Evidence: incident history, escalation path.
- [ ] **S13 — Institutional memory.** Someone who was there remembers why it is built this way a year from now. Evidence: ADRs, handover, named owner.
- [ ] **S14 — Named system owners.** Every critical system has a named owner for security, backups, and operations. Evidence: ownership register. `[baseline]`
