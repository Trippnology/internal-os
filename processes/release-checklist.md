---
name: release-checklist
description: Checklist for shipping a release to customers — gates before, during, after
metadata:
    type: framework
    purpose: Reproducible releases; nothing customer-facing ships unverified
---

# Release Checklist

**Purpose**: Go/no-go gates for a release. Tick every box or record an explicit, dated waiver.

---

## Before the release

### Quality gates

- [ ] Full test suite green, including integration and end-to-end for revenue-critical flows.
- [ ] Known bugs reviewed; nothing unhedged on the P0/P1 list.
- [ ] Migration scripts tested forward against a production-like data snapshot, rollback path rehearsed.
- [ ] Performance checked at expected peak load, not just locally.

### Content and claims

- [ ] Changelog written in customer language, not commit messages.
- [ ] Version numbers bumped everywhere they appear (package metadata, about box, docs).
- [ ] Privacy policy and terms still accurate if data handling changed.
- [ ] Customer-facing docs and help text updated for any behaviour change.

### Safety nets

- [ ] Rollback procedure verified for this specific release (not just theoretically).
- [ ] Backups taken and restorable; backup freshness confirmed.
- [ ] Monitoring and alerting cover the new paths; alerts route to a named human.
- [ ] Feature flags in place for anything risky; kill switch tested.

## Deploy window

- [ ] Deploy during low-traffic hours unless the change is zero-risk.
- [ ] Deploy followed by smoke test against production (health check, one core flow).
- [ ] Declared ready to roll back, with the command written down.

## After the release

- [ ] Watch error rates, uptime monitors, and support channels for at least one operating cycle.
- [ ] Verify a real user data path end to end (signup or first task), not just a status page.
- [ ] Close issues, tag the release, link deploy evidence in the project README (`projects/<name>/README.md`).
- [ ] Post-release retro if anything went sideways; decision log updated with the outcome of any release-time call.

---

_Waiver format: "waived X because Y until Z, agreed by A on DATE". Undated optimism is not a plan._
