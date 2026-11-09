import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = "MEMORY.md";
const SCOPES = ["knowledge/", "projects/", "future/", "document-templates/", "processes/", "agents/"];
const MD_ONLY = /\.md$/;

export function trackedFiles(root) {
	const out = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" });
	return out.split("\0").filter((f) => MD_ONLY.test(f) && SCOPES.some((s) => f.startsWith(s)));
}

function extractLinks(text) {
	const links = [];
	let fence = null;
	let indented = false;
	let blank = true;
	const prose = text.split("\n").map((line) => {
		const marker = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
		if (fence) {
			if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && /^\s*$/.test(marker[2])) fence = null;
			return "";
		}
		if (marker && (marker[1][0] === "~" || !marker[2].includes("`"))) {
			fence = marker[1];
			indented = false;
			blank = false;
			return "";
		}
		const code = /^(?: {4,}|\t)/.test(line);
		if (indented) {
			if (code || !line.trim()) return "";
			indented = false;
		} else if (code && blank) {
			indented = true;
			blank = false;
			return "";
		}
		blank = !line.trim();
		return line;
	}).join("\n").replace(/(?<!`)(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g, (code) => code.replace(/[^\n]/g, " "));
	const lines = prose.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const re = /\[[^\]]*\]\(\s*(?:<([^>\n]*)>|([^\s()]+(?:\([^)\s]*\)[^\s()]*)*))[^)]*\)/g;
		let m;
		while ((m = re.exec(lines[i])) !== null) {
			links.push({ target: m[1] ?? m[2], line: i + 1 });
		}
	}
	return links;
}

function isExternal(target) {
	return /^(?:[a-z][a-z\d+.-]*:|#|\/|\\)/i.test(target);
}

function checkFile(root, file, problems) {
	const abs = join(root, file);
	const targets = new Set();
	let text;
	try {
		text = readFileSync(abs, "utf8");
	} catch (error) {
		problems.push(`${file}:1: cannot read document (${error.code})`);
		return targets;
	}
	for (const { target, line } of extractLinks(text)) {
		if (isExternal(target)) continue;
		let clean;
		try {
			clean = decodeURIComponent(target.split(/[?#]/)[0]);
		} catch {
			problems.push(`${file}:${line}: malformed escape -> ${target}`);
			continue;
		}
		if (!clean || isAbsolute(clean)) continue;
		const resolved = resolve(dirname(abs), clean);
		targets.add(resolved);
		if (!existsSync(resolved)) {
			problems.push(`${file}:${line}: broken link -> ${target}`);
		}
	}
	return targets;
}

export function checkMemoryIndex(root = ROOT) {
	const problems = [];
	const tracked = trackedFiles(root);
	const indexed = checkFile(root, INDEX, problems);
	for (const file of tracked) {
		if (!indexed.has(resolve(root, file))) {
			problems.push(`${file}:1: not indexed in ${INDEX}`);
		}
		checkFile(root, file, problems);
	}
	return problems;
}

if (resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const problems = checkMemoryIndex();
	if (problems.length) {
		console.error(problems.join("\n"));
		console.error(`${problems.length} problem(s).`);
		process.exitCode = 1;
	} else {
		console.log("OK: tracked docs indexed, links resolve.");
	}
}
