---
name: ingest-resource
description: Systematically bring external resources (articles, videos, docs, notes) into the Internal OS
trigger: "/ingest-resource" or when user provides a URL, video, document, or asks to capture/save external content
---

# /ingest-resource

## Purpose

Bring external material into the Internal OS so it's searchable, summarized, and cross-referenced with existing knowledge.

## Trigger

- `/ingest-resource <url or file or content>`
- User sends a URL (article, YouTube, etc.)
- User shares a document or notes to save
- "save this to my system"
- "add this to knowledge/"

## Source Types

### Web Articles

- URL to blog post, news, docs
- Use `mcp__web-reader__webReader` or `WebFetch`
- File under `knowledge/raw/` with source prefix

### YouTube Videos

- YouTube URL
- Extract title, description first
- If transcript available, fetch it
- File under `knowledge/raw/`

### Documents/PDFs

- Local file path or attachment
- Read with `Read` tool
- File under `knowledge/raw/` or type-specific folder

### Heavy Files (>50 pages, decks, spreadsheets)

For bulky files, do not dump the full content into one entry. Build a cheap structural index first so future searches hit the index, not the whole document.

1. **Convert to markdown** (or CSV for tabular) as the canonical source form
2. **Build a structural index**: TOC + each section heading + a one-line summary per section
3. **Save both**: the converted content + the index alongside it (e.g. `2026-08-05--topic.md` + `2026-08-05--topic.index.md`)
4. **Search the index in future**, not the full file. Grep the index for the section, then read only that section of the full file if deeper context is needed

This pattern exists because re-reading a 200-line PDF to find one quote wastes ~30K tokens. The index costs one pass upfront and pays back every search after.

### Notes/Transcripts

- Raw text from user
- File under `knowledge/raw/` for processing

## Implementation Steps

When invoked:

### 1. Detect Source Type

- URL? Check if article, YouTube, or other
- File path? Read and categorize
- Raw text? Treat as notes/transcript

### 1.5 Check sibling repos (de-dup)

- Read `knowledge/references.md`.
- If a referenced repo already covers this topic (e.g. a technical snippet or a distilled fix), do not duplicate it into `knowledge/`.
- Instead, file a one-line pointer entry whose `related:` frontmatter links to the sibling page, or skip filing entirely and just cite the sibling path in your report.

### 2. Fetch or Read Content

- **Web**: Use web-reader MCP for articles
- **YouTube**: Get metadata first, transcript if available
- **File**: Read directly
- **Text**: Use as-is

### 3. Extract Key Information

- Title/source
- Author/creator
- Date (if available)
- Main points/summary (3-5 bullets)
- Notable quotes
- Tags/categories

### 4. Determine Storage Location

- **Customer-specific** → `knowledge/customers/<name>/`
- **Framework/method** → `knowledge/frameworks/`
- **Personal experience** → `knowledge/me/experiences/`
- **General reference** → `knowledge/raw/`

### 5. File Naming

Format: `YYYY-MM-DD--<topic-keyword>.md`

Example: `2025-01-15--distributed-systems-consensus.md`

### 6. Write the Entry

```markdown
---
title: 'Resource Title'
source: URL or file path
author: Creator name
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
related: [../other-file.md]
type: article | video | doc | notes
---

## Summary

[3-5 bullet points of key takeaways]

## Notes

[Detailed notes or transcript excerpts]

## Quotes

> Notable quote worth preserving

## Related

- Link to related knowledge entries
- Skills that reference this
```

### 7. Cross-Reference

- Search `knowledge/` for related entries
- Add `related:` frontmatter links
- Note if this updates or contradicts existing knowledge

### 8. Report Back

- Where it was filed
- What it was tagged with
- What related material was found
- Any duplicates or conflicts detected

## Notes

- Always ask if unsure about categorization
- Duplicates: Check if similar content exists before filing
- For heavy files (>50 pages), use the structural-index pattern above rather than summarising key sections only
- For videos without transcripts, extract from description and comments

## Example Usage

```
User: /ingest-resource https://example.com/article-about-react-performance

System:
[Detected: web article]
[Fetching content...]
[Summarizing...]
Filed to: knowledge/raw/2025-01-15--react-performance.md
Tags: [react, performance, frontend]
Related: ../frameworks/react-patterns.md
```
