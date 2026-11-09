import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, utimesSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkMemoryIndex } from "./check-memory-index.js";
import { checkSystem } from "./check-system.js";

test("checkMemoryIndex", () => {
	const root = mkdtempSync(join(tmpdir(), "cmi-"));
	try {
		execFileSync("git", ["init", "-b", "main"], { cwd: root });
		mkdirSync(join(root, "knowledge"), { recursive: true });
		mkdirSync(join(root, "scripts"), { recursive: true });
		const note = "knowledge/note.md";
		writeFileSync(join(root, note), "body\n");
		writeFileSync(join(root, "MEMORY.md"), "[note](knowledge/note.md)\n");
		execFileSync("git", ["add", "."], { cwd: root });
		assert.deepEqual(checkMemoryIndex(root), []);

		writeFileSync(join(root, "MEMORY.md"), "no links\n");
		assert.deepEqual(checkMemoryIndex(root), [`${note}:1: not indexed in MEMORY.md`]);

		writeFileSync(join(root, "MEMORY.md"), "[note](knowledge/note.md)\n[dead](knowledge/gone.md)\n");
		assert.deepEqual(checkMemoryIndex(root), ["MEMORY.md:2: broken link -> knowledge/gone.md"]);

		const examples = [
			"`[inline](knowledge/gone.md)`",
			"``[inline](knowledge/note.md)``",
			"```md",
			"[example](knowledge/gone.md)",
			"[note](knowledge/note.md)",
			"```",
			"~~~md",
			"[example](knowledge/gone.md)",
			"[note](knowledge/note.md)",
			"~~~",
		].join("\n") + "\n";
		writeFileSync(join(root, "MEMORY.md"), examples);
		assert.deepEqual(checkMemoryIndex(root), [`${note}:1: not indexed in MEMORY.md`]);
		writeFileSync(join(root, "MEMORY.md"), examples + "[`note`](knowledge/note.md)\n");
		assert.deepEqual(checkMemoryIndex(root), []);
		writeFileSync(join(root, note), "body\n[`missing`](gone.md)\n");
		assert.deepEqual(checkMemoryIndex(root), ["knowledge/note.md:2: broken link -> gone.md"]);
		writeFileSync(join(root, note), "body\n");

		writeFileSync(join(root, "knowledge/parens(foo).md"), "body\n");
		execFileSync("git", ["add", "."], { cwd: root });
		writeFileSync(
			join(root, "MEMORY.md"),
			"[note](knowledge/note.md)\n[parens](knowledge/parens(foo).md)\n\n    [example](gone.md)\n",
		);
		assert.deepEqual(checkMemoryIndex(root), []);
		writeFileSync(
			join(root, "MEMORY.md"),
			"[note](knowledge/note.md)\n[parens](knowledge/parens(foo).md)\n[missing](parens(missing).md)\n",
		);
		assert.deepEqual(checkMemoryIndex(root), ["MEMORY.md:3: broken link -> parens(missing).md"]);
		writeFileSync(join(root, "MEMORY.md"), "[note](knowledge/note.md)\n[parens](knowledge/parens(foo).md)\n");

		writeFileSync(join(root, "knowledge/untracked.md"), "untracked\n");
		assert.deepEqual(checkMemoryIndex(root), []);

		const script = join(root, "scripts", "check-memory-index.js");
		writeFileSync(join(root, "package.json"), '{"type":"module"}\n');
		writeFileSync(script, readFileSync(fileURLToPath(new URL("./check-memory-index.js", import.meta.url)), "utf8"));
		const run = () => spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
		const clean = run();
		assert.equal(clean.error, undefined);
		assert.equal(clean.status, 0, clean.stderr);
		writeFileSync(join(root, "MEMORY.md"), "broken\n");
		const bad = run();
		assert.equal(bad.status, 1);
		assert.match(bad.stderr.toString(), /not indexed in MEMORY\.md/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

function isoDaysAgo(days) {
	return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

test("checkSystem", () => {
	const root = mkdtempSync(join(tmpdir(), "csys-"));
	try {
		execFileSync("git", ["init", "-b", "main"], { cwd: root });
		mkdirSync(join(root, "knowledge", "decisions"), { recursive: true });
		mkdirSync(join(root, "scripts"), { recursive: true });
		const note = "knowledge/note.md";
		writeFileSync(join(root, note), "body\n");
		const decision = "knowledge/decisions/2026-01-01--sample.md";
		const decisionText = (outcome) =>
			`---\nname: sample\ndescription: d\nmetadata:\n    type: decision\n    date: ${isoDaysAgo(31)}\n    outcome: ${outcome}\n---\n\n# Decision\n`;
		writeFileSync(join(root, decision), decisionText("pending"));
		writeFileSync(join(root, "MEMORY.md"), `[note](knowledge/note.md)\n[decision](${decision})\n`);
		writeFileSync(join(root, "package.json"), '{"type":"module"}\n');
		execFileSync("git", ["add", "."], { cwd: root });

		assert.deepEqual(checkSystem(root), {
			problems: [],
			notices: [`${decision}: decision pending verification since ${isoDaysAgo(31)} (>30 days) — fill ## Outcome, flip outcome`],
		});

		writeFileSync(join(root, decision), decisionText("held"));
		assert.deepEqual(checkSystem(root).notices, []);

		writeFileSync(join(root, note), "body\n[TODO: expand] with a note on what to add\n");
		const stale = "knowledge/note-stale.md";
		writeFileSync(join(root, stale), "old\n");
		writeFileSync(join(root, "MEMORY.md"), `[note](knowledge/note.md)\n[decision](${decision})\n[stale](knowledge/note-stale.md)\n`);
		execFileSync("git", ["add", "."], { cwd: root });
		const old = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000);
		utimesSync(join(root, stale), old, old);
		const mixed = checkSystem(root);
		assert.deepEqual(mixed.notices, [
			`${stale}: untouched for 200 days (>180) — review: confirm-current, update, or prune`,
			`${note}:2: [TODO: expand] marker — fill in place when session context touches the topic`,
		]);

		const script = join(root, "scripts", "check-system.js");
		for (const name of ["check-memory-index.js", "check-system.js"]) {
			writeFileSync(join(root, "scripts", name), readFileSync(fileURLToPath(new URL(`./${name}`, import.meta.url)), "utf8"));
		}
		const run = () => spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
		const advisoryOnly = run();
		assert.equal(advisoryOnly.status, 0, advisoryOnly.stderr);
		assert.match(advisoryOnly.stderr.toString(), /Notices \(advisory, 2\)/);

		writeFileSync(join(root, "MEMORY.md"), "[dead](knowledge/gone.md)\n");
		const failing = run();
		assert.equal(failing.status, 1);
		assert.match(failing.stderr.toString(), /broken link -> knowledge\/gone\.md/);
		assert.match(failing.stderr.toString(), /Notices \(advisory, 2\)/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
