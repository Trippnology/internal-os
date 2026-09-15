# Internal Operating System

Context repository for ongoing work, reference material, and project artefacts.

## Structure

### knowledge/

Persistent knowledge about people, systems, and reference material.

- **knowledge/me/** - Personal preferences, working style, context about you
  - `knowledge/me/experiences/` - Session learnings, breakthroughs, insights (timestamped)
- **knowledge/customers/** - Client/customer specific context, preferences, history
- **knowledge/frameworks/** - Frameworks, methodologies, mental models you use
- **knowledge/raw/** - Unprocessed reference material, raw notes, temporary storage
- **knowledge/references.md** - Sibling-repo registry (referenced, not ingested)

Each subfolder contains an `EXAMPLE.md` showing the entry format. Copy it, don't edit it.

### .claude/skills/

Reusable procedures and templates. Invoke via `/skill-name` or when patterns match.

**Directory structure:** `.claude/skills/{skill-name}/SKILL.md`

Each skill has:

- `trigger`: When to use it
- Clear purpose and usage patterns
- Implementation steps
- Related dependencies

Available skills:

- `get-started` — Onboarding interview; populates knowledge/me/ and offers to seed other areas on a fresh install
- `improve-system` — System improvement procedures
- `ingest-resource` — Resource ingestion workflows
- `setup-issues` — Add the local numbered issues workflow (issues/ tree + EXAMPLE.md + .gitignore rules + CLAUDE.md note) to any project

Use `.claude/skills/skill/SKILL.md` as template for new skills.

### agents/

Dedicated agent definitions (see `agents/EXAMPLE.md` for the SOUL.md format).

**Structure:** `agents/{name}/SOUL.md` + `agents/{name}/memory/`

Invoke as a persona ("start the <name> agent" — the assistant loads the SOUL.md and works in that role) or via a thin subagent wrapper in your agent platform's config pointing at the SOUL.md. The repo is the source of truth; platform configs are pointers.

### projects/

Active project work. Create one folder per project with its own `README.md` (see `projects/EXAMPLE.md` for the format).

### future/

Forward-looking research, product exploration, and idea reports — not yet committed to as active projects (see `future/EXAMPLE.md`).

## Related repositories

Sibling repos referenced but not ingested. See `knowledge/references.md` for paths, purpose, and the consult-vs-ingest scope rule.

## Usage

Claude reads CLAUDE.md on session start for full context. Update this file when:

- New folders added
- Structure changes
- Important workflows evolve

For a catalog of every knowledge/project entry, see [MEMORY.md](MEMORY.md). Append a line there whenever a new file is added (the `improve-system` skill does this automatically).

Skills provide specialized instructions and workflows for specific tasks.
Use the skill tool to load a skill when a task matches its description.
