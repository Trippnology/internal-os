---
name: improve-system
description: Analyze recent session activity and update Internal OS to reflect learnings, iterations, and improvements. Also the quality gate for creating new skills, the protocol for capturing ACT NOW items at session close, decision/outcome recording (knowledge/decisions/), and the staleness pass over knowledge and project entries.
trigger: "/improve-system" or when user asks to capture lessons, update skills, improve the system, wrap up / park / close a session, or save an ACT NOW item
---

# /improve-system

## Purpose

Capture session learnings back into the Internal OS. The system improves with use. Three jobs: refine existing skills, capture high-value items, decide whether new patterns deserve to become skills.

## Trigger

- `/improve-system`
- "save what we just did"
- "update my system"
- "capture that lesson"
- After significant breakthroughs or iterations
- Session-close cues: "wrap up", "park this", "goodnight", "let's stop here"
- "save this as a skill" after a discovery
- "ACT NOW:" framing for high-value items

## What It Does

### 1. Skill Iterations

If you refined or reworked a skill's output:

- Update that skill's instructions to reflect the new pattern
- Add examples of what worked better
- Note what to avoid

### 2. Lessons & Stories

If you shared personal experiences, insights, or lessons:

- Save to `knowledge/me/experiences/` as `YYYY-MM-DD--topic.md`
- Include context: what happened, what you learned
- Cross-reference related skills or framework entries

### 3. Stale or Duplicated Content

Flag when:

- Two files cover the same ground → merge or clarify distinction
- A skill never gets used → consider deleting
- Knowledge is outdated → note what needs refresh

### 4. Pattern Recognition

If a new pattern emerges across sessions:

- Consider if it should become a skill (run the **Skill-Creation Quality Gate** below before creating)
- Note it in `knowledge/frameworks/` if it's a mental model

### 5. ACT NOW Capture (session close)

When a session is genuinely ending with high-value decisions, capture each one as its own self-contained entry rather than one vague wrap-up.

**Each ACT NOW item** gets its own entry containing:
- the idea or decision in its strongest form
- why it matters
- 2-3 concrete next actions
- provenance when available (date, source file, session context)

**One session summary** records: what the session was about, how many important items emerged, the main themes, and where fuller context lives (file path).

**Do NOT capture:**
- raw session transcript text
- parked or killed items
- obvious duplicates of existing entries

### 6. Skill-Creation Quality Gate

Before creating any new skill, it must pass ALL FOUR:

- **Reusable** — recurs across sessions, not a one-off fix
- **Non-trivial** — cost real time or investigation to discover
- **Specific** — clear trigger conditions (exact phrases, error messages, tool names), not "helps with X"
- **Verified** — the solution actually works, not a guess

If it fails any: log it in `knowledge/me/experiences/` instead. Over-extraction is an anti-pattern — a typical week of active dev produces 1-3 new skills at most.

### 7. Dedup-Before-Create

Before creating a skill (or any knowledge entry):

1. Grep existing skills for related keywords
2. Read `knowledge/references.md` — if a sibling repo already covers it (e.g. a fix that lives in Codex Wiki), file a one-line pointer, do not duplicate
3. If a related skill exists, update it rather than creating a new one

### 8. Skill Pruning Ritual

Periodically review the 5 least-recently-modified skills:

- If unused 30+ days → tighten the trigger conditions (vague triggers = silent skill)
- If genuinely no longer relevant → add `deprecated: true` to frontmatter with a note, do not delete
- Deletion loses provenance; deprecation preserves it

### 9. Decision Capture & Verification

At session close, if the session made a real decision (options weighed, one chosen, consequence expected), offer to record it in `knowledge/decisions/` (format: `EXAMPLE.md` there). One file per decision:

- `## Decision` written now: context, options, choice, reasoning, and a **falsifiable predicted outcome**
- `## Outcome` left as placeholder; frontmatter `outcome: pending`
- Append a MEMORY.md line under `## knowledge/decisions`

During every run, also scan `knowledge/decisions/` for `outcome: pending` entries whose `date:` is older than 30 days. Surface them to the user — verification means filling `## Outcome` and flipping frontmatter `outcome:` to `held`, `wrong`, or `mixed`. Don't verify on the user's behalf without evidence from the session; ask.

Rationale without a prediction is ungradeable. If the user can't state what failure would look like, the entry isn't ready — dig one more question deep.

### 10. Staleness Pass

Session-triggered freshness check (replaces calendar rituals). Threshold: **180 days** by default — change the number here to tune; no other config.

Discovery (cheap, no frontmatter parsing):

```bash
find knowledge projects -name '*.md' -mtime +180 -not -name 'EXAMPLE.md'
```

- Cap at **5 entries per run**, oldest first — staleness is background erosion, not a fire
- For each entry, review with the user; outcome is one of:
  - **confirmed-current** → touch the file or add `reviewed: YYYY-MM-DD` under frontmatter `metadata:`
  - **updated** → refresh content in place
  - **pruned** → delete the file AND remove its MEMORY.md line
- Never batch-prune; each prune is a deliberate user decision

## Implementation Steps

When invoked:

1. **Review the session transcript** - Look for:
   - Skill invocations and their outcomes
   - User feedback like "that's better now" or "I learned that..."
   - Repeated patterns or frustrations
   - Aha moments or insights
   - ACT NOW items and session-close cues

2. **Categorize findings:**
   - **Skill updates** - Which skills need refinement?
   - **New experiences** - What lessons belong in `knowledge/me/experiences/`?
   - **System issues** - Any duplication, staleness, or gaps?
   - **ACT NOW items** - High-value decisions worth their own entry
   - **Skill candidates** - Patterns that might pass the Quality Gate
   - **Decisions** - Choices worth a `knowledge/decisions/` entry (see §9)
   - **Stale entries** - Run the Staleness Pass discovery command (see §10)

3. **Take action:**
   - Update identified skill files
   - Create new experience entries
   - For each ACT NOW item: write a self-contained entry (idea + why + next actions + provenance)
   - Write one session summary
   - For any new skill candidate: run the Quality Gate + Dedup-Before-Create BEFORE creating
   - Record session decisions in `knowledge/decisions/` and surface pending entries >30 days old
   - Review up to 5 stale entries (oldest first); prune removes the MEMORY.md line too
   - Flag structural issues for user review

4. **Report back:**
   - What was updated
   - What was saved (per ACT NOW item + session summary)
   - What needs your attention

## Capture-Quality Checklist

Before an entry is considered done, confirm it is:

- self-contained enough to understand months later
- specific about the decision or next action
- explicit about why it matters
- grounded with provenance when available

Generic wrap-ups ("discussed X") fail this checklist. Specific decisions ("switch webhook retries to queue-based backoff") pass.

## Notes

- This skill operates on the current session context
- It updates the Internal OS in place
- Major structural changes should be confirmed with user first
- Experience entries are timestamped for chronological review
- If capture fails for any reason, do not invent success — tell the user what didn't get saved
