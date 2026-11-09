---
name: deployment-checklist
description: Pre-deploy checks for pushing a build to a live environment
metadata:
    type: framework
    purpose: Nothing reaches customers on vibes; verify, deploy, verify again
---

# Deployment Checklist

**Purpose**: The minute-by-minute list for pushing a build live. Complements the release checklist (which covers release-wide gates); this is the per-deploy loop.

---

## Pre-deploy

- [ ] Correct branch, correct commit, clean CI run on that exact revision.
- [ ] Environment config reviewed — env vars, secrets, flags differ from staging by design, not by accident.
- [ ] Any destructive action (migration, data backfill, cache purge) has a written step-by-step and a person on standby.
- [ ] Temp file cleanup: old builds, stale uploads, debug artifacts not riding along.

## Deploy

- [ ] Changes flagged to anyone sharing the system ("deploying now, expect brief cache drift").
- [ ] Release notes or changelog entry live (internal link at minimum).
- [ ] Deployment executed through the scripted path; ad-hoc console edits are a last resort and get recorded.

## Post-deploy (first 15 minutes)

- [ ] Health check green; version in production matches the intended tag.
- [ ] Smoke test one core flow as a real user: signup, first task, or checkout.
- [ ] Error rate and latency flat on dashboards; no new alerts.
- [ ] Rollback command ready and untested? Test it — read-only dry run at minimum.

## Hotfix path

When production breaks and the window is hostile:

1. Stabilize first (rollback, flag off, previous release) — before diagnosing in place.
2. Then diagnose with the incident timeboxed and a named owner.
3. Postmortem the next working day: timeline, cause, one systemic fix, decision-log entry if it was a judgement call.

---

_Fifteen minutes of verification beats a weekend of "was it the deploy?"_
