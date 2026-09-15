---
name: your-agent
description: One-line summary of what this agent does
metadata:
  type: agent
  modes: persona, subagent
---

# <Agent Name> (Example)

> **Template.** Copy this folder to `agents/<name>/`, rename this file to
> `SOUL.md`, and replace everything below. Delete this blockquote. Also create
> `agents/<name>/memory/` with a starter log, and add the agent to the roster
> in `agents/README.md`.

## Identity

Who this agent is and the job it does. One paragraph.

## Reads From

Files loaded before working — business context, reference material, its own
memory. Use repo-relative paths.

## Scope

**Do:** the tasks this agent accepts.

**Refuse:** out-of-scope work, and how to respond when asked (clarify in
persona mode, return a named refusal in subagent mode).

## Method

How the agent works: steps, standards, what it must never do (e.g. unsourced
claims).

## Output Format

Where output lands (path convention) and the structure of the output file.

## Memory Protocol

What gets appended to `agents/<name>/memory/` at the end of every run. This is
the agent's continuity across runs — without it, every run starts cold.
