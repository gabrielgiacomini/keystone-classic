import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);

if (args.includes('--help')) {
	printHelp();
	process.exit(0);
}

const workflowPath = valueArg('--workflow') || '.github/workflows/ci.yml';
const workflow = readFileSync(resolve(process.cwd(), workflowPath), 'utf8');
const failures: string[] = [];
const jobs = extractJobBlocks(workflow);

assertPattern(workflow, /^\s*push:\s*$/m, 'workflow must run on push');
assertPattern(workflow, /^\s*pull_request:\s*$/m, 'workflow must run on pull_request');
assertPattern(workflow, /^\s*workflow_dispatch:\s*$/m, 'workflow must support workflow_dispatch');
assertPattern(workflow, /^\s*schedule:\s*$/m, 'workflow must include a scheduled trigger for the admin-parity soak');
assertPattern(workflow, /^\s*-\s*cron:\s*['"]?\d+\s+\d+\s+\*\s+\*\s+\*['"]?\s*$/m, 'workflow schedule must run daily');

assertJobContains('lint-typecheck', 'npm run admin-next:typecheck');
assertJobSkipsSchedule('lint-typecheck');

assertJobContains('package-verify', 'npm run ci:verify');
assertJobContains('package-verify', 'npm run build:types');
assertJobContains('package-verify', 'npm run package:verify');
assertJobContains('package-verify', 'npm pack --dry-run');
assertJobSkipsSchedule('package-verify');

assertJobContains('admin-parity', 'npm run test:e2e-ui');
assertJobContains('admin-parity', 'npm run test:e2e-ui:fields');
assertJobContains('admin-parity', 'npm run test:e2e-ui:visual');
assertJobRunsOnSchedule('admin-parity');

if (failures.length) {
	console.error(`CI workflow verification failed for ${workflowPath}`);
	console.error('');
	for (const failure of failures) {
		console.error(`- ${failure}`);
	}
	process.exit(1);
}

console.log(`CI workflow verified: ${workflowPath}`);
console.log('- admin-parity runs on the scheduled workflow and covers UI, field-complete, and visual identity suites');
console.log('- package-verify runs ci:verify, build:types, package:verify, and npm pack --dry-run');
console.log('- lint-typecheck runs admin-next:typecheck');

function assertJobContains(jobName: string, command: string): void {
	const job = jobs.get(jobName);
	if (!job) {
		failures.push(`jobs.${jobName} is missing`);
		return;
	}
	if (!job.includes(command)) {
		failures.push(`jobs.${jobName} must run ${command}`);
	}
}

function assertJobSkipsSchedule(jobName: string): void {
	const job = jobs.get(jobName);
	if (!job) {
		return;
	}
	if (!/^\s*if:\s*github\.event_name\s*!=\s*'schedule'\s*$/m.test(job)) {
		failures.push(`jobs.${jobName} must skip scheduled runs so the schedule remains an admin-parity soak signal`);
	}
}

function assertJobRunsOnSchedule(jobName: string): void {
	const job = jobs.get(jobName);
	if (!job) {
		return;
	}
	if (/^\s*if:\s*github\.event_name\s*!=\s*'schedule'\s*$/m.test(job)) {
		failures.push(`jobs.${jobName} must run on scheduled events for the admin-parity soak`);
	}
}

function assertPattern(text: string, pattern: RegExp, message: string): void {
	if (!pattern.test(text)) {
		failures.push(message);
	}
}

function extractJobBlocks(text: string): Map<string, string> {
	const jobsStart = text.search(/^jobs:\s*$/m);
	if (jobsStart === -1) {
		failures.push('workflow must define jobs');
		return new Map();
	}

	const jobsSection = text.slice(jobsStart);
	const matches = [...jobsSection.matchAll(/^ {2}([A-Za-z0-9_-]+):\s*$/gm)];
	const blocks = new Map<string, string>();
	for (let index = 0; index < matches.length; index += 1) {
		const match = matches[index]!;
		const nextMatch = matches[index + 1];
		blocks.set(match[1]!, jobsSection.slice(match.index, nextMatch?.index));
	}
	return blocks;
}

function valueArg(name: string): string {
	const index = args.indexOf(name);
	if (index === -1) {
		return '';
	}
	return args[index + 1] || '';
}

function printHelp() {
	console.log(`Usage: jiti scripts/ci-workflow-verify.ts [options]

Verify the CI workflow contract required by the migration roadmap.

Options:
  --workflow PATH   Workflow file to inspect. Defaults to .github/workflows/ci.yml.
  --help            Show this help.
`);
}
