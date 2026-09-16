---
name: YYYY-MM-DD--decision-topic
description: One-line summary of what was decided
metadata:
   type: decision
   date: YYYY-MM-DD
   outcome: pending
---

# Decision: <topic>

> Copy this file to `YYYY-MM-DD--<topic>.md`. Fill `## Decision` at decision time.
> Leave `## Outcome` as a placeholder until verification, then flip `outcome:` in the
> frontmatter to `held`, `wrong`, or `mixed`.

## Decision

**Context:** The situation forcing a choice — what was breaking, expensive, or blocking.

**Options considered:**

- Option A — what it promised, what it cost
- Option B — what it promised, what it cost
- Do nothing — the default if no choice is made

**Choice:** What was chosen.

**Reasoning:** Why this option won. What tradeoff was accepted.

**Predicted outcome:** A falsifiable expectation with a timeframe — "X will happen by Y" or
"X will NOT happen". Predictions that can't fail aren't predictions. This line is what the
Outcome section later grades.

## Outcome

*(Filled at verification. Pending entries surface for review after 30 days.)*

**Verified:** YYYY-MM-DD

**What actually happened:** Measured or observed result vs the prediction above.

**Verdict:** One of `held` / `wrong` / `mixed` — also flip `outcome:` in the frontmatter to match.

**Lesson:** What this changes about future recommendations. One paragraph, self-contained.
