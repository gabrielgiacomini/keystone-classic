import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const cliArgs = new Set(process.argv.slice(2));

if (cliArgs.has('--help')) {
	printHelp();
	process.exit(0);
}

type BranchInfo = { protected?: boolean };
type RepoInfo = { full_name?: string; private?: boolean; visibility?: string };
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
const repo = valueArg('--repo') || process.env.GITHUB_REPOSITORY || parseRepository(packageJson.repository?.url);
const branch = valueArg('--branch') || process.env.ADMIN_PARITY_BRANCH || 'main';
const jobName = valueArg('--job') || process.env.ADMIN_PARITY_JOB || 'admin-parity';
const apply = cliArgs.has('--apply');
const force = cliArgs.has('--force');
const status = cliArgs.has('--status');

if (!repo) {
	console.error('Could not determine GitHub repository. Set GITHUB_REPOSITORY=owner/repo or pass --repo owner/repo.');
	process.exit(1);
}

const endpoint = `repos/${repo}/branches/${branch}/protection`;
const body = {
	allow_deletions: false,
	allow_force_pushes: false,
	enforce_admins: false,
	required_conversation_resolution: true,
	required_linear_history: false,
	required_pull_request_reviews: null,
	required_status_checks: {
		contexts: [jobName],
		strict: true,
	},
	restrictions: null,
};
const ghArgs = [
	'api',
	'--method',
	'PUT',
	endpoint,
	'--input',
	'-',
];

if (status) {
	printStatus();
	process.exit(0);
}

if (!apply) {
	console.log('Dry run. Re-run with --apply to update GitHub branch protection.');
	console.log('This helper uses GitHub\'s PUT branch-protection endpoint; use --force only after reviewing existing branch protection.');
	console.log(formatCommand(['gh', ...ghArgs]));
	console.log(JSON.stringify(body, null, 2));
	process.exit(0);
}

const branchInfo = ghJson([`repos/${repo}/branches/${branch}`], { label: 'branch lookup' }) as BranchInfo | null;
if (!branchInfo) {
	process.exit(1);
}

if (branchInfo.protected === true && !force) {
	console.error(`Branch ${branch} is already protected. This helper uses GitHub's PUT branch-protection endpoint and may replace existing settings.`);
	console.error('Review the existing rule in GitHub, update it manually, or re-run with --force after confirming replacement is intended.');
	process.exit(1);
}

const result = spawnSync('gh', ghArgs, {
	encoding: 'utf8',
	input: JSON.stringify(body),
	maxBuffer: 1024 * 1024 * 10,
});

if (result.status !== 0) {
	const message = (result.stderr || result.stdout || '').trim();
	console.error(message);
	if (/Upgrade to GitHub Pro|make this repository public/i.test(message)) {
		console.error('Branch protection is unavailable for this private repository until the owner upgrades GitHub plan or makes the repository public.');
	}
	process.exit(result.status || 1);
}

process.stdout.write(result.stdout);

function printStatus(): void {
	const failures: string[] = [];
	const repoInfo = ghJson([`repos/${repo}`], { label: 'repo lookup' }) as RepoInfo | null;
	const branchInfo = ghJson([`repos/${repo}/branches/${branch}`], { label: 'branch lookup' }) as BranchInfo | null;
	const visibility = repoInfo?.visibility || (repoInfo?.private ? 'PRIVATE' : repoInfo ? 'PUBLIC' : 'unknown');
	const rules = ghJson([`repos/${repo}/rules/branches/${encodeURIComponent(branch)}?per_page=100`], {
		label: 'branch rules lookup',
	});
	const rulesetRequiredChecks = collectRequiredRuleChecks(rules);
	const protectionSources: string[] = [];
	const isClassicProtected = branchInfo?.protected === true;
	const isProtected = isClassicProtected || rulesetRequiredChecks.length > 0;
	let requiredChecks: string[] = [];

	console.log(`Repository: ${repoInfo?.full_name || repo}`);
	console.log(`Visibility: ${visibility}`);
	console.log(`Branch: ${branch}`);
	console.log(`Protected: ${isProtected ? 'yes' : 'no'}`);

	if (!branchInfo) {
		process.exit(1);
	}

	if (isClassicProtected) {
		const statusChecks = ghJson(
			[`repos/${repo}/branches/${branch}/protection/required_status_checks`],
			{ label: 'required status checks lookup', optional: rulesetRequiredChecks.length > 0 },
		);
		const classicRequiredChecks = collectRequiredChecks(statusChecks);
		if (classicRequiredChecks.length) {
			protectionSources.push('classic branch protection');
		}
		requiredChecks = [...classicRequiredChecks];
	}
	if (rulesetRequiredChecks.length) {
		protectionSources.push('active branch ruleset');
		requiredChecks.push(...rulesetRequiredChecks);
	}

	if (isProtected) {
		requiredChecks = Array.from(new Set(requiredChecks));
		console.log(`Required checks: ${requiredChecks.join(', ') || '(none)'}`);
		if (protectionSources.length) {
			console.log(`Protection source: ${protectionSources.join(', ')}`);
		}
	} else {
		console.log('Required checks: (unavailable; branch is not protected)');
	}

	if (!isProtected) {
		failures.push(`Branch ${branch} is not protected.`);
	}
	if (!requiredChecks.some(isAdminParityContext)) {
		failures.push(`Branch protection or active ruleset does not require ${jobName}.`);
	}

	if (failures.length) {
		console.error('admin-parity required check is not ready');
		console.error('');
		for (const failure of failures) {
			console.error(`- ${failure}`);
		}
		if (repoInfo?.private && !isProtected) {
			console.error('');
			console.error('If GitHub rejects branch protection for this private repository, the owner must upgrade GitHub plan or make the repository public before applying the rule.');
		}
		process.exit(1);
	}

	console.log(`admin-parity required check ready for ${repo}@${branch}`);
}

function ghJson(ghArgsForJson: string[], { label, optional = false }: { label: string; optional?: boolean }): unknown {
	const result = spawnSync('gh', ['api', ...ghArgsForJson], {
		encoding: 'utf8',
		maxBuffer: 1024 * 1024 * 10,
	});

	if (result.error) {
		if (!optional) {
			console.error(`Unable to run gh for ${label}: ${result.error.message}`);
		}
		return null;
	}

	if (result.status !== 0) {
		if (!optional) {
			console.error((result.stderr || result.stdout || '').trim());
		}
		return null;
	}

	try {
		return JSON.parse(result.stdout);
	} catch (err) {
		if (!optional) {
			console.error(`GitHub API ${label} returned invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
		}
		return null;
	}
}

function valueArg(name: string): string {
	const index = process.argv.indexOf(name);
	return index === -1 ? '' : process.argv[index + 1] || '';
}

function printHelp(): void {
	console.log(`Usage: jiti scripts/admin-parity-branch-protection.ts [options]

Print/apply the classic GitHub branch-protection rule, or read the live required-check source, required for P4 admin parity.

Options:
  --status         Read the live required-check source without changing GitHub.
  --apply          Apply the classic branch-protection payload with gh api.
  --force          Allow replacing an already protected branch.
  --repo OWNER/REPO
                   Override repository detection.
  --branch NAME    Branch to inspect/protect. Defaults to ADMIN_PARITY_BRANCH or main.
  --job NAME       Required check name. Defaults to ADMIN_PARITY_JOB or admin-parity.
  --help           Show this help.
`);
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

function parseRepository(repositoryUrl: unknown): string {
	if (typeof repositoryUrl !== 'string') {
		return '';
	}
	const match = repositoryUrl.match(/github\.com[:/]([^/]+\/[^/.]+)(?:\.git)?(?:#.*)?$/);
	return match?.[1] || '';
}

function formatCommand(parts: string[]): string {
	return parts.map((part) => {
		if (/^[A-Za-z0-9_./:=\-[\]]+$/.test(part)) {
			return part;
		}
		return `'${part.split("'").join("'\\''")}'`;
	}).join(' ');
}
