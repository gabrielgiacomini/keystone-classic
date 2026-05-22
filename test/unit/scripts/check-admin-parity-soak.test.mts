import { expect } from 'chai';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

const root = process.cwd();

describe('scripts/check-admin-parity-soak', function () {
	let tempDir: string | undefined;

	afterEach(function () {
		if (tempDir) {
			rmSync(tempDir, { force: true, recursive: true });
			tempDir = undefined;
		}
	});

	it('reads paginated workflow runs and matches only the exact admin-parity check', function () {
		writeFakeGh({
			branchProtected: true,
			requiredContexts: ['lint', 'CI / admin-parity'],
			runPages: [
				{
					workflow_runs: [
						{
							created_at: '2026-05-01T00:00:00Z',
							id: 100,
							run_started_at: '2026-05-01T00:00:00Z',
							status: 'completed',
						},
					],
				},
				{
					workflow_runs: [
						{
							created_at: '2026-05-02T00:00:00Z',
							id: 200,
							run_started_at: '2026-05-02T00:00:00Z',
							status: 'completed',
						},
					],
				},
			],
			jobPages: {
				100: [
					{
						jobs: [
							{
								conclusion: 'failure',
								html_url: 'https://example.test/not-admin-parity',
								name: 'CI / not-admin-parity',
								started_at: '2026-05-01T00:00:00Z',
							},
						],
					},
				],
				200: [
					{
						jobs: [
							{
								conclusion: 'success',
								html_url: 'https://example.test/admin-parity',
								name: 'CI / admin-parity',
								started_at: '2026-05-02T00:00:00Z',
							},
						],
					},
				],
			},
		});

		const result = runVerifier({
			ADMIN_PARITY_MIN_GREEN_DAYS: '1',
			ADMIN_PARITY_NOW: '2026-05-03T00:00:00Z',
			ADMIN_PARITY_SOAK_DAYS: '14',
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('admin-parity soak verified');
		expect(result.stdout).to.contain('Green days: 1/14');
		expect(result.stderr).to.equal('');
	});

	it('accepts required status checks returned in GitHub checks shape', function () {
		writeFakeGh({
			branchProtected: true,
			requiredChecks: [{ context: 'CI / admin-parity' }],
			requiredContexts: [],
			runPages: [
				{
					workflow_runs: [
						{
							created_at: '2026-05-01T00:00:00Z',
							id: 225,
							run_started_at: '2026-05-01T00:00:00Z',
							status: 'completed',
						},
					],
				},
			],
			jobPages: {
				225: [
					{
						jobs: [
							{
								conclusion: 'success',
								html_url: 'https://example.test/admin-parity-check-shape',
								name: 'CI / admin-parity',
								started_at: '2026-05-01T00:00:00Z',
							},
						],
					},
				],
			},
		});

		const result = runVerifier({
			ADMIN_PARITY_MIN_GREEN_DAYS: '1',
			ADMIN_PARITY_NOW: '2026-05-03T00:00:00Z',
			ADMIN_PARITY_SOAK_DAYS: '14',
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('admin-parity soak verified');
		expect(result.stderr).to.equal('');
	});

	it('accepts admin-parity required by an active branch ruleset', function () {
		writeFakeGh({
			activeRules: [
				{
					parameters: {
						required_status_checks: [{ context: 'CI / admin-parity' }],
					},
					type: 'required_status_checks',
				},
			],
			branchProtected: false,
			requiredContexts: [],
			runPages: [
				{
					workflow_runs: [
						{
							created_at: '2026-05-01T00:00:00Z',
							id: 275,
							run_started_at: '2026-05-01T00:00:00Z',
							status: 'completed',
						},
					],
				},
			],
			jobPages: {
				275: [
					{
						jobs: [
							{
								conclusion: 'success',
								html_url: 'https://example.test/admin-parity-ruleset',
								name: 'CI / admin-parity',
								started_at: '2026-05-01T00:00:00Z',
							},
						],
					},
				],
			},
		});

		const result = runVerifier({
			ADMIN_PARITY_MIN_GREEN_DAYS: '1',
			ADMIN_PARITY_NOW: '2026-05-03T00:00:00Z',
			ADMIN_PARITY_SOAK_DAYS: '14',
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('admin-parity soak verified');
		expect(result.stderr).to.equal('');
	});

	it('rejects an active branch ruleset that requires a different check', function () {
		writeFakeGh({
			activeRules: [
				{
					parameters: {
						required_status_checks: [{ context: 'CI / lint' }],
					},
					type: 'required_status_checks',
				},
			],
			branchProtected: false,
			requiredContexts: [],
			runPages: [
				{
					workflow_runs: [
						{
							created_at: '2026-05-01T00:00:00Z',
							id: 285,
							run_started_at: '2026-05-01T00:00:00Z',
							status: 'completed',
						},
					],
				},
			],
			jobPages: {
				285: [
					{
						jobs: [
							{
								conclusion: 'success',
								html_url: 'https://example.test/admin-parity-ruleset-wrong-check',
								name: 'CI / admin-parity',
								started_at: '2026-05-01T00:00:00Z',
							},
						],
					},
				],
			},
		});

		const result = runVerifier({
			ADMIN_PARITY_MIN_GREEN_DAYS: '1',
			ADMIN_PARITY_NOW: '2026-05-03T00:00:00Z',
			ADMIN_PARITY_SOAK_DAYS: '14',
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('Branch protection or active branch ruleset does not require admin-parity.');
		expect(result.stderr).to.contain('Required checks: CI / lint.');
	});

	it('does not silently ignore branch rules lookup failures', function () {
		writeFakeGh({
			branchProtected: false,
			requiredContexts: [],
			rulesError: 'gh: branch rules unavailable',
			runPages: [],
			jobPages: {},
		});

		const result = runVerifier({
			ADMIN_PARITY_MIN_GREEN_DAYS: '1',
			ADMIN_PARITY_NOW: '2026-05-03T00:00:00Z',
			ADMIN_PARITY_SOAK_DAYS: '14',
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('GitHub API branch rules lookup failed: gh: branch rules unavailable');
		expect(result.stderr).to.not.contain('No completed admin-parity jobs found');
	});

	it('prints help without requiring gh', function () {
		const result = runVerifier({
			ADMIN_PARITY_NOW: 'not-a-date',
			PATH: '',
		}, ['--help']);

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Usage: jiti scripts/check-admin-parity-soak.ts');
		expect(result.stdout).to.contain('ADMIN_PARITY_SOAK_DAYS');
		expect(result.stderr).to.equal('');
	});

	it('prints required-check setup guidance when the branch is unprotected', function () {
		writeFakeGh({
			branchProtected: false,
			requiredContexts: [],
			runPages: [
				{
					workflow_runs: [
						{
							created_at: '2026-05-01T00:00:00Z',
							id: 250,
							run_started_at: '2026-05-01T00:00:00Z',
							status: 'completed',
						},
					],
				},
			],
			jobPages: {
				250: [
					{
						jobs: [
							{
								conclusion: 'success',
								html_url: 'https://example.test/admin-parity-ok',
								name: 'admin-parity',
								started_at: '2026-05-01T00:00:00Z',
							},
						],
					},
				],
			},
		});

		const result = runVerifier({
			ADMIN_PARITY_MIN_GREEN_DAYS: '1',
			ADMIN_PARITY_NOW: '2026-05-03T00:00:00Z',
			ADMIN_PARITY_SOAK_DAYS: '14',
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('Branch main is not protected.');
		expect(result.stderr).to.contain('Enable branch protection or an active branch ruleset that requires admin-parity');
		expect(result.stderr).to.contain('Required-check setup:');
		expect(result.stderr).to.contain('npm run admin-parity:protect:status');
		expect(result.stderr).to.contain('docs/admin-parity-soak-runbook.md');
		expect(result.stderr).to.not.contain('No completed admin-parity jobs found');
	});

	it('fails when any paginated admin-parity job in the soak window is red', function () {
		writeFakeGh({
			branchProtected: true,
			requiredContexts: ['admin-parity'],
			runPages: [
				{
					workflow_runs: [
						{
							created_at: '2026-05-01T00:00:00Z',
							id: 300,
							run_started_at: '2026-05-01T00:00:00Z',
							status: 'completed',
						},
					],
				},
				{
					workflow_runs: [
						{
							created_at: '2026-05-02T00:00:00Z',
							id: 400,
							run_started_at: '2026-05-02T00:00:00Z',
							status: 'completed',
						},
					],
				},
			],
			jobPages: {
				300: [
					{
						jobs: [
							{
								conclusion: 'success',
								html_url: 'https://example.test/admin-parity-ok',
								name: 'admin-parity',
								started_at: '2026-05-01T00:00:00Z',
							},
						],
					},
				],
				400: [
					{
						jobs: [
							{
								conclusion: 'failure',
								html_url: 'https://example.test/admin-parity-fail',
								name: 'admin-parity',
								started_at: '2026-05-02T00:00:00Z',
							},
						],
					},
				],
			},
		});

		const result = runVerifier({
			ADMIN_PARITY_MIN_GREEN_DAYS: '1',
			ADMIN_PARITY_NOW: '2026-05-03T00:00:00Z',
			ADMIN_PARITY_SOAK_DAYS: '14',
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('1 admin-parity job(s) in the soak window did not succeed.');
		expect(result.stderr).to.contain('admin-parity in run 400 concluded failure');
	});

	it('lists missing UTC green days when the soak window is incomplete', function () {
		writeFakeGh({
			branchProtected: true,
			requiredContexts: ['admin-parity'],
			runPages: [
				{
					workflow_runs: [
						{
							created_at: '2026-05-01T00:00:00Z',
							id: 500,
							run_started_at: '2026-05-01T00:00:00Z',
							status: 'completed',
						},
					],
				},
			],
			jobPages: {
				500: [
					{
						jobs: [
							{
								conclusion: 'success',
								html_url: 'https://example.test/admin-parity-one-day',
								name: 'admin-parity',
								started_at: '2026-05-01T00:00:00Z',
							},
						],
					},
				],
			},
		});

		const result = runVerifier({
			ADMIN_PARITY_MIN_GREEN_DAYS: '3',
			ADMIN_PARITY_NOW: '2026-05-03T12:00:00Z',
			ADMIN_PARITY_SOAK_DAYS: '14',
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('admin-parity has 1 green day(s) in the soak window; expected at least 3.');
		expect(result.stderr).to.contain('Missing green day(s): 2026-05-02, 2026-05-03');
	});

	it('rejects an invalid ADMIN_PARITY_NOW before querying workflow runs', function () {
		writeFakeGh({
			branchProtected: true,
			requiredContexts: ['admin-parity'],
			runPages: [],
			jobPages: {},
		});

		const result = runVerifier({
			ADMIN_PARITY_NOW: 'not-a-date',
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('ADMIN_PARITY_NOW is not a valid date: not-a-date');
		expect(result.stderr).to.not.contain('workflow run lookup');
	});

	function runVerifier(env: NodeJS.ProcessEnv = {}, args: string[] = []) {
		return spawnSync('jiti', ['scripts/check-admin-parity-soak.ts', ...args], {
			cwd: root,
			encoding: 'utf8',
			env: {
				...process.env,
				...env,
				GITHUB_REPOSITORY: 'owner/repo',
				PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
			},
		});
	}

	function writeFakeGh(payload: Record<string, unknown>) {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-fake-gh-'));
		writeFileSync(
			join(tempDir, 'gh'),
			`#!/usr/bin/env node
const payload = ${JSON.stringify(payload)};
const endpoint = process.argv[process.argv.length - 1];

if (!process.argv.includes('api')) {
	process.exit(2);
}

if (endpoint === 'repos/owner/repo/branches/main') {
	process.stdout.write(JSON.stringify({
		protected: payload.branchProtected,
	}));
	process.exit(0);
}

if (endpoint === 'repos/owner/repo/branches/main/protection/required_status_checks') {
	process.stdout.write(JSON.stringify({
		checks: payload.requiredChecks || [],
		contexts: payload.requiredContexts,
	}));
	process.exit(0);
}

if (endpoint === 'repos/owner/repo/rules/branches/main?per_page=100') {
	if (payload.rulesError) {
		process.stderr.write(payload.rulesError);
		process.exit(1);
	}
	process.stdout.write(JSON.stringify(payload.activeRules || []));
	process.exit(0);
}

if (endpoint.startsWith('repos/owner/repo/actions/workflows/ci.yml/runs?')) {
	process.stdout.write(JSON.stringify(payload.runPages));
	process.exit(0);
}

const jobsMatch = endpoint.match(/^repos\\/owner\\/repo\\/actions\\/runs\\/(\\d+)\\/jobs\\?per_page=100$/);
if (jobsMatch) {
	process.stdout.write(JSON.stringify(payload.jobPages[jobsMatch[1]] || [{ jobs: [] }]));
	process.exit(0);
}

process.stderr.write('unexpected gh endpoint: ' + endpoint);
process.exit(1);
`,
			{ mode: 0o755 },
		);
	}
});
