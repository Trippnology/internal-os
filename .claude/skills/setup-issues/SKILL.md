---
name: setup-issues
description: Adds the local numbered issues workflow (issues/ tree + EXAMPLE.md + .gitignore rules + CLAUDE.md note) to any project.
trigger: "/setup-issues [path]", "add issues workflow to <project>", "set up local issue tracker", or invoked when bootstrapping project-level issue tracking in a target repo.
---

# Setup Issues

Add the local numbered issues workflow to a target project. Creates the directory
tree, the template, the gitignore rules, and the CLAUDE.md section that documents
the lifecycle — a pattern proven across projects.

## Purpose

Stand up the `issues/` workflow in any project so feature requests, bugs, and
improvement ideas can be tracked as numbered Markdown files. Issues are **local
working state** (gitignored), not shared history; only `EXAMPLE.md` is tracked.

## Trigger patterns

- "/setup-issues [path]"
- "add issues workflow to \<project\>"
- "set up local issue tracker in \<project\>"
- invoked when bootstrapping project-level tracking after the user mentions wanting a backlog

## Prerequisites

- Write access to the target project root.
- Target is a git repo (recommended — the `.gitignore` step is meaningless
  otherwise; warn but continue if not).

The **target root** is the path the user supplies. If none supplied, ask. Do not
default to cwd silently.

## Implementation

Run these four steps against the target root. All steps are idempotent —
re-running on an already-set-up project is a no-op.

### 1. Create the directory tree

```bash
mkdir -p {target}/issues/completed {target}/issues/deferred
```

Produces:

```
issues/
├── completed/
└── deferred/
```

`mkdir -p` is inherently idempotent — safe to re-run.

### 2. Write `issues/EXAMPLE.md`

**Skip if `{target}/issues/EXAMPLE.md` already exists** — never overwrite a
customized template. Read first; only write on not-found.

Write this content verbatim:

````markdown
# Example: {Short title — what's being requested}

> **Template.** Copy this file to `issues/{NNN}-{slug}.md` — next free integer,
> zero-padded to 3 digits, plus a kebab-case title slug (e.g. `002-add-dark-mode.md`)
> — and replace everything below. Delete this blockquote. Keep the section
> structure — it's the contract.
>
> See `CLAUDE.md` → **Issues** for the file lifecycle.

One short paragraph framing the problem. What's broken, missing, or undesirable,
and why it matters. Cite evidence with `path/file.js:line` so the next reader
(an agent or future-you) can find the spot immediately. Keep the *what + why*
here; leave the *how* for the Solution section below.

**Priority: medium (non-blocker).**
<!-- Omit the priority line entirely if it isn't decided yet. -->
**Status: deferred.**
<!-- Optional. If used, the next paragraph must explain what unblocks it. -->

## Requirements

Each bullet is one acceptance criterion — a single, checkable "done" test.

- Concrete behaviour the system must exhibit after the fix.
- Name the file, route, model, or function that must change (`app/routes/foo.js:42`).
- One idea per bullet — split compound requirements into separate items.
- Prefer "X must do Y" over "consider doing X" — leaves no ambiguity at review time.

## Solution (known)

<!-- Optional. Omit entirely when the approach is open and you want to discuss
     options first. Include it when the path is clear and you want to record
     the reasoning before implementation drifts. -->

- Implementation sketch in bullets — the shape, not full code.
- Call out decision points and their tradeoffs.
- Reference patterns to mirror: "port X from project-y", "match the shape of
  `app/routes/bar.js`", "reuse the helper in `lib/utils.js`".
- Note any prerequisites that block landing (ops changes, schema migrations,
  dependency upgrades, replica-set conversion, etc.).

## Notes

<!-- Optional. Use for links, related issues, follow-ups. Omit if empty. -->

- Related: `issues/012-broken-widgets.md` (touches the same code path).
- Reference: <https://example.com/spec> for the underlying spec.
````

### 3. Patch `.gitignore`

Grep `{target}/.gitignore` for the literal string `issues/*`.

- **Rule already present** → skip (no-op).
- **File exists, rule absent** → append the block below.
- **File missing** → create it with the block below.

Block to append (verbatim):

```gitignore
# Issues — local working files; only EXAMPLE.md is tracked
issues/*
!issues/EXAMPLE.md
```

`issues/*` ignores everything inside `issues/` (including `completed/` and
`deferred/` contents); `!issues/EXAMPLE.md` re-includes the template so the
format contract is tracked.

### 4. Patch `CLAUDE.md`

Grep `{target}/CLAUDE.md` for the `## Issues` heading.

- **Heading already present** → skip (no-op).
- **File exists, heading absent** → append the section below at end of file
  (predictable placement; user can relocate later).
- **File missing** → create a stub: `# {basename of target dir}\n\n` + the
  section below.

Section to append (verbatim):

```markdown
## Issues

Local numbered backlog of feature requests, bugs, and improvement ideas.
One Markdown file per issue.

Filenames are `{NNN}-{slug}.md`: the next free integer zero-padded to 3 digits,
plus a short kebab-case title — e.g. `001-broken-widgets.md`, `002-add-some-feature.md`.

- `issues/{NNN}-{slug}.md` — active issue.
- `issues/completed/{NNN}-{slug}.md` — done. Moved here on completion (preserve filename).
- `issues/deferred/{NNN}-{slug}.md` — parked. Moved here with a `Status: deferred` note explaining what unblocks it.
- `issues/EXAMPLE.md` — format template. Copy to `issues/{NNN}-{slug}.md` to start a new issue.

The whole `issues/` tree is gitignored except `EXAMPLE.md` — issues are local
working state, not shared history. Don't delete completed/deferred files; they
record what was considered and how it was resolved.
```

## Idempotency

Every step checks for prior work before writing. Re-running the skill on a
project that already has the workflow should produce zero changes:

| Step             | Check                            | Action if present      |
| ---------------- | -------------------------------- | ---------------------- |
| dirs             | `mkdir -p`                       | n/a (always safe)      |
| EXAMPLE.md       | file exists                      | skip — never overwrite |
| `.gitignore`     | `issues/*` line found            | skip append            |
| `CLAUDE.md`      | `## Issues` heading found        | skip append            |

## Result

After a successful run, the target project has:

- `issues/`, `issues/completed/`, `issues/deferred/` directories
- `issues/EXAMPLE.md` — the format template (tracked in git)
- `.gitignore` ignoring `issues/*` except `issues/EXAMPLE.md`
- `CLAUDE.md` documenting the file lifecycle under `## Issues`

Verify:

```bash
ls {target}/issues/
# Expect: EXAMPLE.md  completed  deferred

git -C {target} check-ignore -v {target}/issues/001-broken-widgets.md {target}/issues/EXAMPLE.md
# Expect: issues/001-broken-widgets.md ignored; issues/EXAMPLE.md NOT ignored
```

## Related

- **`improve-system` skill** — use it after closing issues to capture what was
  learned back into the system.
