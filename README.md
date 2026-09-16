# Internal OS

A **context repository and knowledge system** for ongoing work, reference material, and project artefacts. Designed for AI-assisted development sessions to maintain continuity, capture learning, and accelerate future work.

---

## What This Is

A personal knowledge management system optimized for AI-assisted development. It stores:

- **Who you are** — Skills, preferences, context
- **What you know** — Frameworks, mental models, reference material
- **What you're working on** — Active projects with their own context
- **How you work** — Reusable skills and procedures

Your AI assistant reads `CLAUDE.md` on session start, giving every new conversation immediate context about you and your work.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/trippnology/internal-os.git
cd internal-os
```

This is a starting point, not a product — rename the folder, rebrand it, and reshape it to fit how you work.

### 2. Open it with your AI agent

Launch your agent (Claude Code, opencode, etc.) in the repository root. It reads `CLAUDE.md` on session start and picks up the structure and available skills automatically.

### 3. Run `/get-started`

The system ships empty by design. Run the skill and your agent interviews you — one question at a time — then writes your `knowledge/me/` entries and updates `MEMORY.md`. When the basics are done, it offers to seed other areas:

| You want the agent to know about... | Where it goes                                           |
| ----------------------------------- | ------------------------------------------------------- |
| Clients you serve                   | `knowledge/customers/` (see `EXAMPLE.md`)               |
| Methodologies you use               | `knowledge/frameworks/` (see `EXAMPLE.md`)              |
| Sibling repos you reference         | `knowledge/references.md`                               |
| Active projects                     | `projects/<name>/README.md` (see `projects/EXAMPLE.md`) |
| Ideas you're exploring              | `future/` (see `future/EXAMPLE.md`)                     |

### 4. Use it

- **Every session** — context loads automatically; no re-explaining yourself
- **`/improve-system`** — capture learnings and update entries after significant work
- **`/ingest-resource`** — file articles, videos, and docs into `knowledge/`
- **`/setup-issues`** — add a local issue tracker to any project

---

## Structure

```
internal-os/
├── .claude/
│   └── skills/           # Reusable procedures (invoke via /skill-name)
├── agents/               # Dedicated agent definitions (SOUL.md + memory/, see EXAMPLE.md)
├── future/               # Forward-looking ideas and research (not active work)
├── knowledge/
│   ├── customers/        # Client context, history, preferences
│   ├── decisions/        # Paired decision/outcome records (see EXAMPLE.md)
│   ├── frameworks/       # Methodologies, mental models
│   ├── me/               # Personal context
│   │   └── experiences/  # Timestamped learnings, insights
│   ├── raw/              # Process docs and reference material
│   └── references.md     # Sibling-repo registry (referenced, not ingested)
├── projects/
│   └── <project>/       # One folder per project, each with its own README
├── CLAUDE.md             # Project docs (read each session)
├── README.md             # This file
└── MEMORY.md             # Index of all knowledge entries
```

---

## What's Here Now

### Skills (`.claude/skills/`)

| Skill             | Purpose                                             | Trigger                               |
| ----------------- | --------------------------------------------------- | ------------------------------------- |
| `get-started`     | Onboard a fresh install via interview               | First session in a new clone          |
| `improve-system`  | Capture session learnings back into the system      | After significant work sessions       |
| `ingest-resource` | Systematically bring external resources in          | When adding articles, videos, docs    |
| `setup-issues`    | Add a local numbered issues workflow to any project | Bootstrapping a project issue tracker |
| `skill`           | Template for creating new skills                    | When you notice a repeatable pattern  |

**Usage**: Invoke with `/skill-name` or when the assistant detects the trigger pattern.

### Agents (`agents/`)

Dedicated agents — research, drafting, whatever repeats — defined as portable `SOUL.md` files with a `memory/` folder for continuity across runs (see `agents/EXAMPLE.md`). Run them as an in-session persona ("start the research agent") or through a thin subagent wrapper in your agent platform's config that points at the SOUL.md. The repo stays the source of truth.

### Knowledge (`knowledge/`)

- **`me/`** — Personal context (technical profile, business, working style; `EXAMPLE-voice.md` for a voice guide covering agent working voice and public/business voice). `experiences/` holds timestamped learnings.
- **`customers/`** — One file per client (context, history, preferences). Use whatever location conventions fit your setup.
- **`decisions/`** — One file per decision, paired with its later-verified outcome.
- **`frameworks/`** — Methodologies and mental models.
- **`raw/`** — Process documents and reference material.
- **`references.md`** — Sibling-repo registry (referenced, not ingested).

The live catalogue of every entry lives in [MEMORY.md](MEMORY.md).

### Projects (`projects/`)

Each subfolder is a project with its own README providing context and current state. See [MEMORY.md](MEMORY.md) for the current set.

---

## How to Use It

### During a Session

1. **Context is automatic** — your AI assistant reads `CLAUDE.md` on session start
2. **Invoke skills** — Use `/skill-name` for reusable procedures
3. **Reference knowledge** — The assistant can access any file in `knowledge/`
4. **Work in projects** — Each `projects/` folder can have its own context

### Adding Knowledge

**Format**: Markdown with YAML frontmatter

```yaml
---
name: topic-name
description: One-line summary
metadata:
 	type: user|reference|project|customer|framework|experience|future|decision
 	# plus type-specific fields (location, purpose, status, started, date, outcome...)
---
# Title

Content here...
```

**Naming**:

- Time-based: `YYYY-MM-DD--topic-keyword.md` (experiences, decisions)
- Stable: `descriptive-name.md` (references, frameworks, customers)

**Always**: Update [MEMORY.md](MEMORY.md) with a one-line pointer (`improve-system` does this automatically).

---

## Related repositories

Sibling repos are referenced, not ingested. See `knowledge/references.md` for the registry and the consult-vs-ingest scope rule. The `ingest-resource` skill checks it before filing, to avoid duplicating content that already lives in a sibling.

---

## Making It Yours

The structure above is a starting point. Bend it to fit how you actually work — the system only pays off when it mirrors your reality.

### Project Templates

Add `.claude/templates/` for documents you produce repeatedly:

- Project kickoff checklist
- Client onboarding questions
- Technical audit checklist

### Task Tracking

Pick whatever matches your workflow:

- Simple `TODO.md` in each project folder
- Run `/setup-issues` for a local numbered backlog (`issues/` tree per project)
- Integration with external tools (GitHub Issues)

### Decision Log

Add `knowledge/decisions/` for:

- Major technical decisions and why
- Architecture choices
- Tool selections

**Format**: `YYYY-MM-DD--decision-topic.md`, one file per decision. Each entry pairs `## Decision` (written at choice time: context, options, choice, reasoning, and a falsifiable predicted outcome) with `## Outcome` (filled at verification). Frontmatter tracks status — `outcome: pending` until verified, then `held`, `wrong`, or `mixed`. See `knowledge/decisions/EXAMPLE.md`. The `improve-system` skill offers to record decisions at session close and surfaces pending entries older than 30 days for verification.

### Search-First Knowledge

Create `search.md` indexing:

- Technologies you know
- Problems you've solved
- Frameworks you use

Fast recall — "What was that thing about X again?"

### Output Artefacts

Create `outputs/` for:

- Reusable code snippets
- Configuration patterns
- Refined boilerplate

Never solve the same problem twice.

### New Skills

When a pattern repeats across sessions, make it a skill:

1. Copy `.claude/skills/skill/SKILL.md` to `.claude/skills/<skill-name>/SKILL.md`
2. Fill in trigger, purpose, implementation
3. Add it to the table in this README and in `CLAUDE.md`

Existing skills are yours to edit too — extend `ingest-resource` with new source types, tighten `improve-system` triggers, whatever earns its keep.

### Prune Ruthlessly

- Skills you never invoke → delete or sharpen their triggers
- Knowledge folders you don't use → drop them from the structure and from `CLAUDE.md`
- The `MEMORY.md` index only helps if it stays accurate

The system should shrink as often as it grows.

---

## Patterns & Conventions

### Skill Structure

```yaml
---
name: skill-name
description: One-line summary
trigger: When to use
---
# Skill Name
## Purpose
## Usage (trigger patterns)
## Implementation (steps)
## Notes (caveats, dependencies)
```

### File Naming

- Time-based: `YYYY-MM-DD--topic-keyword.md`
- Stable: `descriptive-name.md`
- All lowercase, hyphen-separated

### Cross-References

Link related entries with relative markdown links in a `## Related` section at the foot of a file, e.g. `[a-mental-model](../frameworks/a-mental-model.md)`. Update [MEMORY.md](MEMORY.md) with each new entry.

---

## Why This Works

| Need                             | Solution                    |
| -------------------------------- | --------------------------- |
| Remember context across sessions | MEMORY.md + frontmatter     |
| Reusable procedures              | `.claude/skills/`           |
| Project continuity               | `projects/` with READMEs    |
| Personal growth tracking         | `knowledge/me/experiences/` |
| Client context                   | `knowledge/customers/`      |
| No duplication across repos      | `knowledge/references.md`   |

---

## Quick Reference

- **New knowledge** → Add to `knowledge/`, update MEMORY.md
- **New skill** → Copy `skill` template, implement
- **New project** → Create folder in `projects/`, add README
- **New customer** → `knowledge/customers/<slug>.md`
- **Capture learning** → Run `/improve-system`
- **Ingest resource** → Run `/ingest-resource`

---

## License

[MIT](LICENSE) — fork it, rebrand it, make it yours.

---

_This system grows with you. Start small, add as you go._

## See Also

Similar systems worth a look if you want to borrow elements:

- [The Cognitive File System](https://www.bionicbusiness.com/p/cognitive-file-system-agents) — agent-focused take on the same idea: per-agent `SOUL.md` definitions, decision/outcome memory logs, and business context files for a fleet of agents rather than a solo operator

---

Created by [Trippnology](https://trippnology.com/), inspired by Andre Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
