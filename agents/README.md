# Agent Roster

Dedicated agents defined in this repo. Each agent is a folder with a `SOUL.md` (the definition) and a `memory/` folder (its continuity across runs). The repo is the source of truth; platform configs are thin pointers.

## Agents

| Agent | Does | Modes | Definition |
|---|---|---|---|
| `research` | Brief-in, sourced-report-out web/technical/market/competitor research; reports land in `knowledge/raw/` | persona, subagent | [research/SOUL.md](research/SOUL.md) |

## Invocation

- **Persona**: "start the research agent" in a session → the assistant loads the SOUL.md and works in that role, interactively.
- **Subagent**: a thin wrapper in your agent platform's config points at the SOUL.md; delegation happens when a task matches its description, or explicitly via a mention (`@research`). Subagent mode is one-shot: no clarifying questions, state assumptions instead.

## Adding an agent

1. Copy `agents/EXAMPLE.md` to `agents/<name>/SOUL.md` (identity, reads-from, scope, method, output format, memory protocol)
2. Create `agents/<name>/memory/` with a starter log
3. Add a row above and a [MEMORY.md](../MEMORY.md) line
4. Optionally add a thin subagent wrapper in your agent platform's config pointing at the SOUL.md
