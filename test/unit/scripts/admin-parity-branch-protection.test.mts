import { expect } from 'chai';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

const root = process.cwd();

type RequiredChecks = {
	checks?: Array<{ context: string }>;
	contexts?: string[];
};

type BranchRule = {
	parameters: {
		required_status_checks: Array<{ context: string }>;
	};
	type: string;
};

type FakeGhOptions = {
	activeRules?: BranchRule[];
	protected: boolean;
	privateRepo?: boolean;
	requiredChecks?: RequiredChecks;
	protectionError?: string;
	rulesError?: string;
};

describe('scripts/admin-parity-branch-protection', function () {
	let tempDir: string | undefined;

	afterEach(function () {
		if (tempDir) {
			rmSync(tempDir, { force: true, recursive: true });
			tempDir = undefined;
		}
	});

	it('prints a dry-run gh command by default', function () {
		const result = runScript('--repo', 'owner/repo', '--branch', 'release', '--job', 'admin-parity-custom');

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Dry run. Re-run with --apply to update GitHub branch protection.');
		expect(result.stdout).to.contain('PUT branch-protection endpoint');
		expect(result.stdout).to.contain('repos/owner/repo/branches/release/protection');
		expect(result.stdout).to.contain('--input -');
		expect(result.stdout).to.contain('"contexts": [');
		expect(result.stdout).to.contain('"admin-parity-custom"');
		expect(result.stderr).to.equal('');
	});

	it('prints help without requiring gh', function () {
		const result = runScript('--help');

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Usage: jiti scripts/admin-parity-branch-protection.ts');
		expect(result.stdout).to.contain('live required-check source');
		expect(result.stdout).to.contain('--status');
		expect(result.stdout).to.contain('--apply');
		expect(result.stdout).to.contain('--force');
		expect(result.stderr).to.equal('');
	});

	it('reports live required-check source status without mutating GitHub', function () {
		writeFakeGh({ protected: false, privateRepo: true });
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--status', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});

		expect(result.status).to.equal(1);
		expect(result.stdout).to.contain('Repository: owner/repo');
		expect(result.stdout).to.contain('Visibility: PRIVATE');
		expect(result.stdout).to.contain('Protected: no');
		expect(result.stdout).to.contain('Required checks: (unavailable; branch is not protected)');
		expect(result.stderr).to.contain('Branch main is not protected.');
		expect(result.stderr).to.contain('Branch protection or active ruleset does not require admin-parity.');
		expect(result.stderr).to.contain('upgrade GitHub plan or make the repository public');
		expect(existsSync(join(tempDir!, 'body.json'))).to.equal(false);
	});

	it('reports ready status when admin-parity is required', function () {
		writeFakeGh({ protected: true, requiredChecks: { checks: [{ context: 'ci / admin-parity' }] } });
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--status', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Protected: yes');
		expect(result.stdout).to.contain('Required checks: ci / admin-parity');
		expect(result.stdout).to.contain('admin-parity required check ready for owner/repo@main');
		expect(result.stderr).to.equal('');
		expect(existsSync(join(tempDir!, 'body.json'))).to.equal(false);
	});

	it('reports ready status when an active branch ruleset requires admin-parity', function () {
		writeFakeGh({
			activeRules: [
				{
					parameters: {
						required_status_checks: [{ context: 'ci / admin-parity' }],
					},
					type: 'required_status_checks',
				},
			],
			protected: false,
			requiredChecks: { contexts: [] },
		});
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--status', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Protected: yes');
		expect(result.stdout).to.contain('Required checks: ci / admin-parity');
		expect(result.stdout).to.contain('Protection source: active branch ruleset');
		expect(result.stdout).to.contain('admin-parity required check ready for owner/repo@main');
		expect(result.stderr).to.equal('');
		expect(existsSync(join(tempDir!, 'body.json'))).to.equal(false);
	});

	it('rejects an active branch ruleset that does not require admin-parity', function () {
		writeFakeGh({
			activeRules: [
				{
					parameters: {
						required_status_checks: [{ context: 'ci / lint' }],
					},
					type: 'required_status_checks',
				},
			],
			protected: false,
			requiredChecks: { contexts: [] },
		});
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--status', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});

		expect(result.status).to.equal(1);
		expect(result.stdout).to.contain('Protected: yes');
		expect(result.stdout).to.contain('Required checks: ci / lint');
		expect(result.stderr).to.contain('Branch protection or active ruleset does not require admin-parity.');
		expect(existsSync(join(tempDir!, 'body.json'))).to.equal(false);
	});

	it('does not silently ignore branch rules lookup failures', function () {
		writeFakeGh({
			protected: false,
			rulesError: 'gh: branch rules unavailable',
		});
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--status', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('gh: branch rules unavailable');
		expect(result.stderr).to.contain('admin-parity required check is not ready');
		expect(existsSync(join(tempDir!, 'body.json'))).to.equal(false);
	});

	it('applies the expected gh command only when --apply is passed', function () {
		writeFakeGh({ protected: false });
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--apply', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});
		const ghArgs = JSON.parse(readFileSync(join(tempDir!, 'args.json'), 'utf8'));
		const body = JSON.parse(readFileSync(join(tempDir!, 'body.json'), 'utf8'));

		expect(result.status).to.equal(0);
		expect(result.stdout).to.equal('{"ok":true}');
		expect(ghArgs).to.deep.equal([
			'api',
			'--method',
			'PUT',
			'repos/owner/repo/branches/main/protection',
			'--input',
			'-',
		]);
		expect(body).to.deep.equal({
			allow_deletions: false,
			allow_force_pushes: false,
			enforce_admins: false,
			required_conversation_resolution: true,
			required_linear_history: false,
			required_pull_request_reviews: null,
			required_status_checks: {
				contexts: ['admin-parity'],
				strict: true,
			},
			restrictions: null,
		});
	});

	it('refuses to replace an existing protected branch without --force', function () {
		writeFakeGh({ protected: true });
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--apply', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('Branch main is already protected.');
		expect(result.stderr).to.contain('re-run with --force');
		expect(existsSync(join(tempDir!, 'body.json'))).to.equal(false);
	});

	it('allows replacement of an existing protected branch with --force', function () {
		writeFakeGh({ protected: true });
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--apply', '--force', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});
		const body = JSON.parse(readFileSync(join(tempDir!, 'body.json'), 'utf8'));

		expect(result.status).to.equal(0);
		expect(body.required_status_checks.contexts).to.deep.equal(['admin-parity']);
	});

	it('adds actionable guidance when GitHub rejects private-repo branch protection', function () {
		writeFakeGh({
			protected: false,
			protectionError: 'gh: Upgrade to GitHub Pro or make this repository public to enable this feature',
		});
		const result = runScript('--repo', 'owner/repo', '--branch', 'main', '--job', 'admin-parity', '--apply', {
			PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
		});

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('Upgrade to GitHub Pro or make this repository public');
		expect(result.stderr).to.contain('Branch protection is unavailable for this private repository');
	});

	function runScript(...params: Array<string | NodeJS.ProcessEnv>) {
		const maybeEnv = params.at(-1);
		const env = maybeEnv && typeof maybeEnv === 'object' ? params.pop() as NodeJS.ProcessEnv : {};
		return spawnSync('jiti', ['scripts/admin-parity-branch-protection.ts', ...(params as string[])], {
			cwd: root,
			encoding: 'utf8',
			env: {
				...process.env,
				...env,
			},
		});
	}

	function writeFakeGh({ activeRules = [], protected: protectedBranch, privateRepo = false, requiredChecks = { contexts: ['admin-parity'] }, protectionError = '', rulesError = '' }: FakeGhOptions) {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-fake-gh-protection-'));
		writeFileSync(
			join(tempDir, 'gh'),
			`#!/usr/bin/env node
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const args = process.argv.slice(2);
const endpoint = args.find((arg) => arg.startsWith('repos/'));
const protectionError = ${JSON.stringify(protectionError)};
const rulesError = ${JSON.stringify(rulesError)};
if (endpoint === 'repos/owner/repo') {
	process.stdout.write(JSON.stringify({
		full_name: 'owner/repo',
		private: ${JSON.stringify(privateRepo)},
		visibility: ${JSON.stringify(privateRepo ? 'PRIVATE' : 'PUBLIC')},
	}));
	process.exit(0);
}
if (endpoint === 'repos/owner/repo/branches/main') {
	process.stdout.write(JSON.stringify({ protected: ${JSON.stringify(protectedBranch)} }));
	process.exit(0);
}
if (endpoint === 'repos/owner/repo/branches/main/protection/required_status_checks') {
	process.stdout.write(${JSON.stringify(JSON.stringify(requiredChecks))});
	process.exit(0);
}
if (endpoint === 'repos/owner/repo/rules/branches/main?per_page=100') {
	if (rulesError) {
		process.stderr.write(rulesError);
		process.exit(1);
	}
	process.stdout.write(${JSON.stringify(JSON.stringify(activeRules))});
	process.exit(0);
}
writeFileSync(join(${JSON.stringify(tempDir)}, 'args.json'), JSON.stringify(args));
writeFileSync(join(${JSON.stringify(tempDir)}, 'body.json'), readFileSync(0, 'utf8'));
if (protectionError) {
	process.stderr.write(protectionError);
	process.exit(1);
}
process.stdout.write('{"ok":true}');
`,
			{ mode: 0o755 },
		);
	}
});
