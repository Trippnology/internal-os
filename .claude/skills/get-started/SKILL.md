---
name: get-started
description: Onboard a fresh Internal OS install — interview the user one question at a time, populate knowledge/me/ from the EXAMPLE.md formats, update MEMORY.md, then offer to seed other knowledge areas.
trigger: "/get-started", "set up my system", "interview me", "get started", or a first session in a fresh clone where knowledge/me/ contains only EXAMPLE.md
---

# Get Started

## Purpose

Bootstrap an empty Internal OS. The system is only useful once it knows who is using it. This skill runs a short interview, writes the initial `knowledge/me/` entries, indexes them in `MEMORY.md`, and offers to seed the remaining areas.

## Trigger patterns

- `/get-started`
- "set up my system", "interview me", "get started"
- Detected automatically: `knowledge/me/` contains only `EXAMPLE.md`

## Implementation

When invoked:

### 1. Preflight

Check the current state:

- `knowledge/me/` holds only `EXAMPLE.md` → fresh install, proceed
- Real entries already exist → this is a top-up, not a first run. Ask what to add or refresh before touching anything. Never overwrite silently.

### 2. Interview — one question at a time

Ask **one question per message**. Wait for the answer. Ask a brief follow-up only when the answer is unclear or thin. Topic order:

1. **Background** — what kind of work do you do, how long, what domains
2. **Stack** — languages, frameworks, tools you work in daily; anything you deliberately avoid
3. **Work style** — communication preferences, deep-work hours, how you like to collaborate
4. **Current focus** — what you're working on right now, active projects worth recording

Rules:

- Skip any topic the user declines
- Never invent or infer preferences the user didn't state
- If the user answers several topics at once, absorb it — don't re-ask

### 3. Write the entries

- Copy `knowledge/me/EXAMPLE.md` as the format → write `knowledge/me/technical-profile.md` (or a better-fitting stable name)
- If session learnings surfaced, add `knowledge/me/experiences/YYYY-MM-DD--topic.md` using that folder's `EXAMPLE.md` format
- Do not edit the `EXAMPLE.md` files themselves

### 4. Update MEMORY.md

Append one line per new entry under the correct section: `[name](knowledge/me/<file>.md) — essence`.

### 5. Offer to seed more

Ask which of these to set up now (any, all, or none — skipping is a fine answer):

| Area | Target | Format source |
| ---- | ------ | ------------- |
| Clients you serve | `knowledge/customers/` | `EXAMPLE.md` |
| Methodologies you use | `knowledge/frameworks/` | `EXAMPLE.md` |
| Sibling repos you reference | `knowledge/references.md` | table in file |
| Active projects | `projects/<name>/README.md` | `projects/EXAMPLE.md` |
| Ideas you're exploring | `future/` | `future/EXAMPLE.md` |

For each chosen area, run the same one-question-at-a-time flow, write the entry, update `MEMORY.md`.

### 6. Report back

- Files written (paths)
- `MEMORY.md` lines added
- Areas seeded vs skipped
- Suggest running `/improve-system` after the first real work session to start the capture loop

## Expected Outcome

- `knowledge/me/` contains at least one real entry
- `MEMORY.md` indexes every new entry
- The user answered a short conversational interview, not a form

## Red Flags

- **"You're rushing"** — dumping all questions in one message defeats the interview. One question, one message, always.
- **"You're inventing"** — writing plausible-sounding preferences the user never stated poisons the system. Only record what was said.
- **"You're editing the template"** — `EXAMPLE.md` files are format references; copy them, never modify them.

## Notes

- Re-runnable: later runs top up or refresh entries rather than replace them
- Keep answers verbatim where possible — the user's own words are better context than paraphrase
- If the user wants a different interview topic order, follow theirs
