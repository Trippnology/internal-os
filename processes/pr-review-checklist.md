---
name: pr-review-checklist
description: Checklist for reviewing a pull request or change set before merge
metadata:
    type: framework
    purpose: Consistent review quality; catches the failure classes that hurt later
---

# PR Review Checklist

**Purpose**: What a reviewer checks, in order, before approving. Works for human or AI-assisted review.

---

## Before reading code

- PR description states the problem, the approach, and how it was verified. If not, return it — do not guess intent.
- Scope is one thing. A PR doing three jobs gets split.
- Tests exist and pass locally; new behaviour has new tests.

## First read — intent

- Read the diff top to bottom as a narrative. Does the implementation match the stated problem?
- Look for the obvious failure scenario first: what breaks this? Who does it cost?

## Second read — the checklist

### Correctness

- [ ] Edge cases handled: empty, zero, negative, huge, unicode names, unexpected input.
- [ ] Failure paths exist, not just the happy path — timeouts, retries, errors surface to a human who can act.
- [ ] Data model changes are deliberate (schema, migrations forward and back).
- [ ] Money and timestamps: integer money in minor units, UTC or timezone-aware timestamps.

### Security and data safety

- [ ] Authorization enforced server-side for new routes/actions, not only in the UI.
- [ ] Input validated at the boundary; no unescaped output at any sink.
- [ ] No secrets, credentials, or personal data in the diff, logs, or test fixtures.
- [ ] Tenant scoping intact — no new query missing its filter.

### Maintainability

- [ ] Naming matches existing conventions in this repo.
- [ ] No dead code, commented-out blocks, or unused dependencies added.
- [ ] Complex logic has a comment explaining why (not what), where it is not self-evident.

### Operations

- [ ] Config changes documented (env vars, flags); defaults safe for production.
- [ ] Rollback story: a bad merge can be reverted without data migration pain.
- [ ] Anything irreversible (destructive migration, external side effect) explicitly flagged in the PR description.

## Verdict vocabulary

- **Approve** — merge as is.
- **Approve with notes** — merge; notes are follow-ups, not blockers; record them in the issues tracker.
- **Request changes** — specific, actionable, with an example fix. Make it unambiguous which comments block the merge and which are optional polish.

---

_Review comments state the failure scenario, not the preference: "this throws on unicode usernames, see E2" beats "bad style"._
