import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const cliArgs = new Set(process.argv.slice(2));

if (cliArgs.has('--help')) {
	printHelp();
	process.exit(0);
}

const root = process.cwd();
type BranchInfo = { protected?: boolean };
type Run = { created_at?: string; id: number | string; run_started_at?: string; status?: string };
type Job = { conclusion?: string; html_url?: string; name?: string; started_at?: string };
type MatchingJob = { conclusion?: string; htmlUrl?: string; name?: string; runId: number | string; startedAt: string };
type StatusChecks = { checks?: Array<{ context?: string }>; contexts?: string[] };
type Rule = {
	parameters?: {
		required_status_checks?: Array<{ context?: string }>;
	};
	type?: string;
};

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as {
	repository?: { url?: string };
};

const repo = process.env.GITHUB_REPOSITORY || parseRepository(packageJson.repository?.url);
const branch = process.env.ADMIN_PARITY_BRANCH || 'main';
const workflow = process.env.ADMIN_PARITY_WORKFLOW || 'ci.yml';
const jobName = process.env.ADMIN_PARITY_JOB || 'admin-parity';
const soakDays = parsePositiveInteger(process.env.ADMIN_PARITY_SOAK_DAYS, 14);
const minGreenDays = parsePositiveInteger(process.env.ADMIN_PARITY_MIN_GREEN_DAYS, soakDays);
const failures: string[] = [];
const details: string[] = [];
const now = process.env.ADMIN_PARITY_NOW ? new Date(process.env.ADMIN_PARITY_NOW) : new Date();
const invalidNow = Number.isNaN(now.getTime());
const since = invalidNow ? null : new Date(now.getTime() - soakDays * 24 * 60 * 60 * 1000);

if (invalidNow) {
	failures.push(`ADMIN_PARITY_NOW is not a valid date: ${process.env.ADMIN_PARITY_NOW}`);
}

if (!repo) {
	failures.push('Could not determine GitHub repository. Set GITHUB_REPOSITORY=owner/repo.');
} else {
	await checkBranchProtection();
	if (!invalidNow && failures.length === 0) {
		await checkWorkflowSoak();
	}
}

if (failures.length) {
	console.error('admin-parity soak verification failed');
	console.error('');
	for (const failure of failures) {
		console.error(`- ${failure}`);
	}
	if (details.length) {
		console.error('');
		console.error('Details:');
		for (const detail of details) {
			console.error(`- ${detail}`);
		}
	}
	if (details.some((detail) => detail.includes('admin-parity:protect'))) {
		console.error('');
		console.error('Required-check setup:');
		console.error('- Check live state: npm run admin-parity:protect:status');
		console.error('- Print/apply required rule: npm run admin-parity:protect');
		console.error('- Runbook: docs/admin-parity-soak-runbook.md');
	}
	process.exit(1);
}

console.log(`admin-parity soak verified for ${repo}@${branch}`);
console.log(`Required check: ${jobName}`);
console.log(`Green days: ${minGreenDays}/${soakDays}`);
console.log(`Window start: ${since?.toISOString()}`);
console.log(`Window end: ${now.toISOString()}`);

async function checkBranchProtection(): Promise<void> {
	const branchInfo = ghJson([`repos/${repo}/branches/${branch}`], { label: 'branch lookup' }) as BranchInfo | null;
	if (!branchInfo) {
		return;
	}

	const branchRules = ghJson([`repos/${repo}/rules/branches/${encodeURIComponent(branch)}?per_page=100`], {
		label: 'branch rules lookup',
	});
	const rulesetContexts = collectRequiredRuleChecks(branchRules);
	const classicContexts: string[] = [];
	const isProtected = branchInfo.protected === true || rulesetContexts.length > 0;

	if (!isProtected) {
		failures.push(`Branch ${branch} is not protected.`);
		details.push(`Enable branch protection or an active branch ruleset that requires ${jobName}; start with: npm run admin-parity:protect:status`);
		return;
	}

	if (branchInfo.protected === true) {
		const statusChecks = ghJson(
			[`repos/${repo}/branches/${branch}/protection/required_status_checks`],
			{ label: 'required status checks lookup', optional: rulesetContexts.length > 0 },
		);
		if (statusChecks) {
			classicContexts.push(...collectRequiredChecks(statusChecks));
		}
	}

	const contexts = Array.from(new Set([...classicContexts, ...rulesetContexts]));

	if (!contexts.some(isAdminParityContext)) {
		failures.push(`Branch protection or active branch ruleset does not require ${jobName}. Required checks: ${contexts.join(', ') || '(none)'}.`);
		details.push(`Update branch protection or an active branch ruleset to require ${jobName}; start with: npm run admin-parity:protect:status`);
	}
}

async function checkWorkflowSoak(): Promise<void> {
	if (!since) {
		return;
	}
	const runQuery = new URLSearchParams({
		branch,
		created: `>=${since.toISOString()}`,
		per_page: '100',
	});
	const completedRuns = ghPaginatedItems([
		`repos/${repo}/actions/workflows/${encodeURIComponent(workflow)}/runs?${runQuery.toString()}`,
	], { itemKey: 'workflow_runs', label: 'workflow run lookup' });
	if (!completedRuns) {
		return;
	}

	const matchingJobs: MatchingJob[] = [];
	for (const run of completedRuns.filter((run) => run.status === 'completed')) {
		const jobs = ghPaginatedItems([
			`repos/${repo}/actions/runs/${run.id}/jobs?per_page=100`,
		], { itemKey: 'jobs', label: `jobs lookup for run ${run.id}` });
		if (!jobs) {
			continue;
		}

		for (const job of jobs) {
			if (isAdminParityContext(job.name)) {
				matchingJobs.push({
					conclusion: job.conclusion,
					htmlUrl: job.html_url,
					name: job.name,
					runId: run.id,
					startedAt: job.started_at || run.run_started_at || run.created_at || '',
				});
			}
		}
	}

	if (matchingJobs.length === 0) {
		failures.push(`No completed ${jobName} jobs found on ${branch} since ${since.toISOString()}.`);
		return;
	}

	const failedJobs = matchingJobs.filter((job) => job.conclusion !== 'success');
	if (failedJobs.length) {
		failures.push(`${failedJobs.length} ${jobName} job(s) in the soak window did not succeed.`);
		for (const job of failedJobs.slice(0, 5)) {
			details.push(`${job.name} in run ${job.runId} concluded ${job.conclusion}: ${job.htmlUrl}`);
		}
	}

	const greenDays = new Set(
		matchingJobs
			.filter((job) => job.conclusion === 'success')
			.map((job) => new Date(job.startedAt).toISOString().slice(0, 10)),
	);

	if (greenDays.size < minGreenDays) {
		failures.push(`${jobName} has ${greenDays.size} green day(s) in the soak window; expected at least ${minGreenDays}.`);
		const missingDays = expectedGreenDayKeys().filter((day) => !greenDays.has(day));
		if (missingDays.length) {
			details.push(`Missing green day(s): ${missingDays.join(', ')}`);
		}
	}

	details.push(`${matchingJobs.length} completed ${jobName} job(s) found since ${since.toISOString()}.`);
}

function expectedGreenDayKeys(): string[] {
	const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	return Array.from({ length: minGreenDays }, (_, index) => {
		const day = new Date(end);
		day.setUTCDate(end.getUTCDate() - (minGreenDays - index - 1));
		return day.toISOString().slice(0, 10);
	});
}

function ghPaginatedItems(args: string[], { itemKey, label }: { itemKey: string; label: string }): Array<Run & Job & Record<string, unknown>> | null {
	const pages = ghJson(['--paginate', '--slurp', ...args], { label });
	if (!pages) {
		return null;
	}

	if (!Array.isArray(pages)) {
		failures.push(`GitHub API ${label} returned a non-array paginated response.`);
		return null;
	}

	const items: Array<Run & Job & Record<string, unknown>> = [];
	for (const page of pages) {
		const pageItems = (page as Record<string, unknown>)[itemKey];
		if (!Array.isArray(pageItems)) {
			failures.push(`GitHub API ${label} page did not include an array at ${itemKey}.`);
			return null;
		}
		items.push(...pageItems);
	}
	return items;
}

function ghJson(args: string[], { label, optional = false }: { label: string; optional?: boolean }): unknown {
	const result = spawnSync('gh', ['api', ...args], {
		cwd: root,
		encoding: 'utf8',
		maxBuffer: 1024 * 1024 * 10,
	});

	if (result.error) {
		if (!optional) {
			failures.push(`Unable to run gh for ${label}: ${result.error.message}`);
		}
		return null;
	}

	if (result.status !== 0) {
		const message = (result.stderr || result.stdout || '').trim();
		if (!optional) {
			failures.push(`GitHub API ${label} failed: ${message}`);
		}
		return null;
	}

	try {
		return JSON.parse(result.stdout);
	} catch (err) {
		if (!optional) {
			failures.push(`GitHub API ${label} returned invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
		}
		return null;
	}
}

function collectRequiredChecks(statusChecks: unknown): string[] {
	const checks = statusChecks as StatusChecks | null;
	return [
		...(Array.isArray(checks?.contexts) ? checks.contexts : []),
		...(Array.isArray(checks?.checks) ? checks.checks.map((check) => check.context) : []),
	].filter((context): context is string => typeof context === 'string' && context.length > 0);
}

function collectRequiredRuleChecks(rules: unknown): string[] {
	if (!Array.isArray(rules)) {
		return [];
	}
	return (rules as Rule[])
		.filter((rule) => rule?.type === 'required_status_checks')
		.flatMap((rule) => Array.isArray(rule.parameters?.required_status_checks)
			? rule.parameters.required_status_checks.map((check) => check.context)
			: [])
		.filter((context): context is string => typeof context === 'string' && context.length > 0);
}

function isAdminParityContext(context: unknown): boolean {
	if (typeof context !== 'string') {
		return false;
	}
	const normalized = context.trim();
	return normalized === jobName || normalized.endsWith(` / ${jobName}`);
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
	if (value === undefined) {
		return fallback;
	}
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function printHelp(): void {
	console.log(`Usage: jiti scripts/check-admin-parity-soak.ts [options]

Verify the P4 admin-parity required-check and 14-day green soak gate.

Environment:
  GITHUB_REPOSITORY              Repository in owner/repo form.
  ADMIN_PARITY_BRANCH            Branch to verify. Defaults to main.
  ADMIN_PARITY_WORKFLOW          Workflow file/name. Defaults to ci.yml.
  ADMIN_PARITY_JOB               Job/check name. Defaults to admin-parity.
  ADMIN_PARITY_SOAK_DAYS         Soak window in days. Defaults to 14.
  ADMIN_PARITY_MIN_GREEN_DAYS    Required green days. Defaults to soak days.
  ADMIN_PARITY_NOW               Override current time for deterministic checks.

Options:
  --help                         Show this help.
`);
}

function parseRepository(repositoryUrl: unknown): string {
	if (typeof repositoryUrl !== 'string') {
		return '';
	}
	const match = repositoryUrl.match(/github\.com[:/]([^/]+\/[^/.]+)(?:\.git)?(?:#.*)?$/);
	return match?.[1] || '';
}
