import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { basename, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';

const PROPOSALS_DIR = 'data/proposals';
const TEMPLATE_PATH = '.claude/skills/equill-labs-update/templates/proposal.diff.tmpl';

type Args = { target?: string; proposal?: string; reason?: string };

function parseArgs(argv: string[]): Args {
	const out: Args = {};
	for (let i = 2; i < argv.length; i++) {
		const arg = argv[i];
		const next = argv[i + 1];
		if (arg === '--target' && next) {
			out.target = next;
			i++;
		} else if (arg === '--proposal' && next) {
			out.proposal = next;
			i++;
		} else if (arg === '--reason' && next) {
			out.reason = next;
			i++;
		}
	}
	return out;
}

function atomicWrite(path: string, content: string) {
	mkdirSync(dirname(path), { recursive: true });
	const tmp = `${path}.tmp`;
	writeFileSync(tmp, content);
	renameSync(tmp, path);
}

function computeUnifiedDiff(target: string, proposal: string): string {
	const res = spawnSync(
		'git',
		['diff', '--no-index', '--no-color', '--unified=3', target, proposal],
		{ encoding: 'utf8' },
	);
	// `git diff --no-index` exits 1 when files differ, 0 when identical.
	if (res.status !== 0 && res.status !== 1) {
		console.error('ERR_GIT_DIFF');
		console.error(res.stderr || res.stdout);
		process.exit(2);
	}
	return res.stdout ?? '';
}

function applyTemplate(target: string, filename: string, reason: string, diffBody: string): string {
	const timestamp = new Date().toISOString();
	if (existsSync(TEMPLATE_PATH)) {
		const tmpl = readFileSync(TEMPLATE_PATH, 'utf8');
		return tmpl
			.replaceAll('{target}', target)
			.replaceAll('{timestamp}', timestamp)
			.replaceAll('{reason}', reason)
			.replaceAll('{filename}', filename)
			.replaceAll('{unified_diff}', diffBody);
	}
	// Fallback header if template is missing
	return (
		`# Proposal: ${target}\n` +
		`# Generated: ${timestamp}\n` +
		`# Reason: ${reason}\n` +
		`# Apply:  git apply ${PROPOSALS_DIR}/${filename}\n` +
		`# Reject: rm ${PROPOSALS_DIR}/${filename}\n\n` +
		diffBody
	);
}

function main() {
	const args = parseArgs(process.argv);
	if (!args.target || !args.proposal) {
		console.error('Usage: tsx scripts/propose-diffs.ts --target <file> --proposal <temp-file> [--reason <text>]');
		process.exit(1);
	}
	if (!existsSync(args.target)) {
		console.error(`ERR_NO_TARGET: ${args.target}`);
		process.exit(1);
	}
	if (!existsSync(args.proposal)) {
		console.error(`ERR_NO_PROPOSAL: ${args.proposal}`);
		process.exit(1);
	}

	const reason = args.reason ?? 'No reason supplied';
	const diffBody = computeUnifiedDiff(args.target, args.proposal);

	if (!diffBody.trim()) {
		console.log(`No differences between ${args.target} and ${args.proposal}. No proposal written.`);
		return;
	}

	const filename = `${basename(args.target)}.diff`;
	const outPath = `${PROPOSALS_DIR}/${filename}`;
	const content = applyTemplate(args.target, filename, reason, diffBody);
	atomicWrite(outPath, content);

	console.log(`Wrote ${outPath}`);
	console.log(`  Review: git apply --check ${outPath}`);
	console.log(`  Apply:  git apply ${outPath}`);
	console.log(`  Reject: rm ${outPath}`);
}

main();
