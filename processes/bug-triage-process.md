---
name: bug-triage-process
description: Repeatable process for triaging incoming bugs — capture, classify, schedule, close
metadata:
    type: framework
    purpose: Same triage every time; severity by impact, not by who shouted loudest
---

# Bug Triage Process

**Purpose**: A single pass turns any incoming bug report into a scheduled, owned, reproducible issue — or a documented no-fix.

---

## 1. Capture

- Record the report verbatim in the issues tracker before diagnosing (see `document-templates/general/issue-template.md` for the intake format).
- Note who it affects (one user vs all), when it started, and what changed recently (release, config, dependency).

## 2. Reproduce

- Reproduce on the reporter's conditions first: same device class, same account shape, same data volume. Bugs that only reproduce at scale are real bugs.
- No reproduction yet? Label `cannot-reproduce` with a request for specifics; do not guess a cause and close.
- Capture evidence: screenshot, exact steps, log excerpt, request/response.

## 3. Classify

Severity — impact times likelihood:

| Severity | Meaning | Response |
|----------|---------|----------|
| **S1 — Critical** | Data loss/corruption, security exposure, everyone blocked, money wrong | Immediate; hotfix path; comms to affected users |
| **S2 — Major** | Core workflow broken for many, workaround missing or ugly | Current sprint |
| **S3 — Minor** | Degraded experience, workaround exists | Backlog, scheduled |
| **S4 — Cosmetic** | UI polish, no functional impact | Backlog, opportunistic |

- Security reports get an immediate privacy hold: do not discuss details in public trackers or with uninvolved staff.

## 4. Schedule and own

- Every bug leaves triage with an owner and a target milestone (or an explicit `wontfix` with a reason).
- Group related reports into one issue with count of reporters — five quiet people count more than one loud one.

## 5. Fix and close

- Fix lands with a regression test proving it, and the issue links the test.
- Closing comment states: cause, fix, test, where the fix shipped (version).
- Tell the reporter what shipped and when. Silence reads as "never fixed".

---

_Triage rule: the squeaky wheel gets attention, but the schedule belongs to impact. Write down both._
