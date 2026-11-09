# Internal OS

Your AI assistant forgets everything between sessions. This folder fixes that.

Think of it as a shared brain for you and your AI — or an operating manual for your business that your AI can read. Every session starts with context you never had to type twice.

## The problem

Every AI session starts from zero. You re-explain your business, your clients, your preferences, and how you like things done — every single time.

## The promise

Your AI assistant (Claude Code, opencode, or similar) reads this folder at the start of every session and instantly knows you, your clients, your decisions, and your way of working.

## What that looks like in practice

- **Agency owner with recurring clients** — "My AI knows each client's history, preferences and what we've tried before. I never re-brief it between sessions, and new project setup takes minutes instead of an afternoon."
- **Solo consultant juggling many small projects** — "Every project has its own context file, so switching deadlines mid-week doesn't mean losing the thread. It remembers where I left off and what was agreed."
- **Small team tired of re-litigating old decisions** — "Big decisions get logged with what we expected to happen. Months later we check: was that call right? The AI reminds us of the reasoning before anyone spends money repeating a mistake."
- **Business owner shipping an AI-built app** — "Before launch, my AI runs a full readiness audit — security, data safety, integrations — and tells me not-ready/conditional/ready in plain terms, not developer jargon."

## What's in the box

| Piece | What you get |
|---|---|
| `AGENTS.md` | The map your AI reads every session |
| `knowledge/` | Your context: clients, frameworks, decisions, personal profile |
| `.claude/skills/` | Repeatable procedures (checklists your AI follows) |
| `agents/` | Dedicated AI personas with memory that survives runs |
| `processes/` | Repeatable playbooks: kickoff, PR review, release, bug triage, deployment |
| `document-templates/general/` | Document formats worth copying |
| `scripts/` | Health checks that keep the system tidy at launch |
| `projects/`, `future/` | Active work and not-yet-committed ideas |

It ships **empty on purpose** — no content until you add yours. Nothing generic lives here but the structure.

---

## Get started

### 1. Clone the repository

```bash
git clone https://github.com/trippnology/internal-os.git
cd internal-os
```

This is a starting point, not a product — rename the folder, rebrand it, and reshape it to fit how you work.

### 2. Open it with your AI agent

Launch your agent in the repository root. It reads `AGENTS.md` on session start and picks up the structure and available skills automatically.

### 3. Run `/get-started`

Your agent interviews you — one question at a time — then writes your `knowledge/me/` entries (personal context) and updates the index. When the basics are done, it offers to seed other areas:

| You want the agent to know about... | Where it goes                            |
| ----------------------------------- | ---------------------------------------- |
| Clients you serve                   | `knowledge/customers/` (see `EXAMPLE.md`) |
| Methodologies you use               | `knowledge/frameworks/` (see `EXAMPLE.md`) |
| Sibling repos you reference         | `knowledge/references.md`                 |
| Active projects                     | `projects/<name>/README.md` (see `projects/EXAMPLE.md`) |
| Ideas you're exploring              | `future/` (see `future/EXAMPLE.md`)       |

### 4. Use it day to day

- **Every session** — context loads automatically; no re-explaining yourself
- **`/improve-system`** — capture what the session learned back into the system
- **`/ingest-resource`** — file articles, videos, and docs into `knowledge/`
- **`/setup-issues`** — add a local issue tracker to any project

---

## Structure

```
internal-os/
├── .claude/
│   └── skills/                # Reusable procedures (invoke via /skill-name)
│       └── hardcore-app-audit # Production-readiness audit (+ references/ checklist)
├── agents/                    # Dedicated agent definitions (SOUL.md + memory/)
│   ├── EXAMPLE.md             # SOUL.md format template
│   ├── README.md              # Agent roster + invocation modes
│   └── research/              # Research agent (brief-in, sourced-report-out)
├── document-templates/
│   └── general/               # Client issue report template; add your own
├── future/                    # Forward-looking ideas and research (not active work)
├── knowledge/
│   ├── customers/             # Client context, history, preferences (EXAMPLE.md ships)
│   ├── decisions/             # Paired decision/outcome records (EXAMPLE.md ships)
│   ├── frameworks/            # Methodologies, mental models (EXAMPLE.md ships)
│   ├── me/                    # Personal context (EXAMPLE.md + EXAMPLE-voice.md ship)
│   │   └── experiences/       # Timestamped learnings, insights
│   ├── raw/                   # Ingested resources and reference material (EXAMPLE.md ships)
│   └── references.md          # Sibling-repo registry (referenced, not ingested)
├── processes/                 # Repeatable playbooks: kickoff, PR review, release,
│                              # bug triage, deployment
├── projects/                  # One folder per project, each with its own README
├── scripts/                   # Repo health checks + tests (Node.js 22.7+, Git)
├── AGENTS.md                  # Project docs (read each session)
├── README.md                  # This file
└── MEMORY.md                  # Index of every knowledge/project entry
```

### Skills (`.claude/skills/`)

| Skill             | Purpose                                             | Trigger                               |
| ----------------- | --------------------------------------------------- | ------------------------------------- |
| `get-started`     | Onboard a fresh install via interview               | First session in a new clone          |
| `improve-system`  | Capture session learnings back into the system      | After significant work sessions       |
| `ingest-resource` | Systematically bring external resources in          | When adding articles, videos, docs    |
| `setup-issues`    | Add a local numbered issues workflow to any project | Bootstrapping a project issue tracker |
| `hardcore-app-audit` | Evidence-based pre-launch readiness audit        | "Is this app ready for paying customers?" |
| `skill`           | Template for creating new skills                    | When you notice a repeatable pattern  |

Invoke with `/skill-name` or when the agent detects the trigger pattern.

### Validation (`scripts/`)

Two dependency-free checks keep the system honest (Node.js **22.7+** and Git required):

```bash
node scripts/check-memory-index.js   # every catalogued doc needs an index line; links resolve
node scripts/check-system.js         # same + advisories: decisions awaiting verification, stale entries, [TODO: expand] markers
node --test scripts/*.test.js        # regression tests for the checks
```

`check-system.js` problems exit 1; advisories alone exit 0.

---

## How to Use It

### During a Session

1. **Context is automatic** — your AI assistant reads `AGENTS.md` on session start
2. **Invoke skills** — `/skill-name` for repeatable procedures
3. **Reference knowledge** — the agent can access any file in `knowledge/`
4. **Work in projects** — each `projects/` folder carries its own context

### The index (`MEMORY.md`)

One line per file: `path → what it is`. The agent greps here first. Append a line whenever you add a file (the `improve-system` skill does this automatically). Use whatever conventions help your setup — the shipped one covers `knowledge/`, `agents/`, `processes/`, `document-templates/`, `projects/`, and `future/`.

### Making It Yours

- **Client context** — one file in `knowledge/customers/` per client: history, preferences, what was tried
- **Decision log** — `knowledge/decisions/` pairs each call with a later check of whether it was right; entries older than 30 days surface via the validator
- **Voice** — optionally copy `knowledge/me/EXAMPLE-voice.md` to `voice.md` so agent-written drafts sound like you, not like AI
- **Templates** — copy formats you reuse into `document-templates/`; ship process docs in `processes/`
- **Prune ruthlessly** — drop skills and folders you never use; the system should shrink as often as it grows

---

## Patterns & Conventions

### Frontmatter

YAML at the top of a note (4-space indent by convention here) — the overview block that machines read first:

```yaml
---
name: topic-name
description: One-line summary
metadata:
    type: user|reference|project|customer|framework|experience|future|decision
---
```

### File Naming

- Time-based: `YYYY-MM-DD--topic-keyword.md` (experiences, decisions)
- Stable: `descriptive-name.md` (references, frameworks, customers)
- All lowercase, hyphen-separated

### Thin Sections

When an answer is thin, write what you got and mark the gap:

```markdown
[TODO: expand] — what to add goes here
```

Ship at 70%. A greppable marker lets `/improve-system` treat gaps as first-class work for a later session. Never pad a thin section with invented filler.

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
- **Audit an app** → Run `/hardcore-app-audit <path>`

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
