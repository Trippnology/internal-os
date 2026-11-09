import { statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkMemoryIndex, trackedFiles, ROOT } from "./check-memory-index.js";

// Thresholds are tuned in step with the improve-system skill:
// §9 decisions (30-day verification window), §10 staleness (180 days).
const DECISION_VERIFY_DAYS = 30;
const STALE_DAYS = 180;
const STALE_CAP = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

// Convention-only YAML: frontmatter keys of interest (type, date, outcome)
// are the indented ones. Nothing here parses YAML for real.
function parseFrontmatter(text) {
	if (!text.startsWith("---\n")) return null;
	const end = text.indexOf("\n---", 4);
	if (end === -1) return null;
	const meta = {};
	for (const line of text.slice(4, end).split("\n")) {
		const m = /^\s+([a-z_]+):\s*(.*)$/.exec(line);
		if (m) meta[m[1]] = m[2];
	}
	return meta;
}

function checkPendingDecisions(texts, notices) {
	const cutoff = Date.now() - DECISION_VERIFY_DAYS * DAY_MS;
	for (const [file, text] of texts) {
		if (!file.startsWith("knowledge/decisions/")) continue;
		const meta = parseFrontmatter(text);
		if (meta?.outcome !== "pending") continue;
		const decisionDate = meta.date;
		const date = new Date(decisionDate);
		if (Number.isNaN(date.getTime()) || date.getTime() > cutoff) continue;
		notices.push(`${file}: decision pending verification since ${decisionDate} (>${DECISION_VERIFY_DAYS} days) — fill ## Outcome, flip outcome`);
	}
}

function checkStaleEntries(root, files, notices) {
	const entries = files
		.filter((f) => !f.endsWith("/EXAMPLE.md"))
		.map((f) => ({ file: f, mtimeMs: statSync(`${root}/${f}`).mtimeMs }))
		.sort((a, b) => a.mtimeMs - b.mtimeMs)
		.slice(0, STALE_CAP);
	for (const { file, mtimeMs } of entries) {
		const ageDays = Math.floor((Date.now() - mtimeMs) / DAY_MS);
		if (ageDays <= STALE_DAYS) break;
		notices.push(`${file}: untouched for ${ageDays} days (>${STALE_DAYS}) — review: confirm-current, update, or prune`);
	}
}

function checkExpandMarkers(texts, notices) {
	for (const [file, text] of texts) {
		for (const [i, line] of text.split("\n").entries()) {
			if (line.includes("[TODO: expand]")) {
				notices.push(`${file}:${i + 1}: [TODO: expand] marker — fill in place when session context touches the topic`);
			}
		}
	}
}

export function checkSystem(root) {
	const problems = checkMemoryIndex(root);
	const notices = [];
	const texts = new Map(trackedFiles(root).map((f) => [f, readFileSync(`${root}/${f}`, "utf8")]));
	checkPendingDecisions(texts, notices);
	checkStaleEntries(root, [...texts.keys()], notices);
	checkExpandMarkers(texts, notices);
	return { problems, notices };
}

if (resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const { problems, notices } = checkSystem(ROOT);
	if (problems.length) {
		console.error(problems.join("\n"));
		console.error(`${problems.length} problem(s).`);
		process.exitCode = 1;
	} else {
		console.log("OK: tracked docs indexed, links resolve.");
	}
	if (notices.length) {
		console.error(`Notices (advisory, ${notices.length}):`);
		console.error(notices.join("\n"));
	}
}
