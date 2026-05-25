import { expect } from 'chai';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

const root = process.cwd();

describe('scripts/admin-parity-final-gate', function () {
	let tempDir: string | undefined;

	afterEach(function () {
		if (tempDir) {
			rmSync(tempDir, { force: true, recursive: true });
			tempDir = undefined;
		}
	});

	it('prints the required final gate order in dry-run mode', function () {
		const result = spawnSync('jiti', ['scripts/admin-parity-final-gate.ts', '--dry-run'], {
			cwd: root,
			encoding: 'utf8',
		});

		expect(result.status).to.equal(0);
		expect(result.stderr).to.equal('');
		expect(result.stdout.trim().split('\n')).to.deep.equal([
			'npm run admin-parity:ledger',
			'npm run admin-decommission:audit',
			'npm run lint',
			'npm run typecheck',
			'npm run build-dev',
			'npm run build',
			'npm run test:unit',
			'npm run test:e2e-api',
			'npm run admin-parity',
			'npm run package:verify',
			'npm run admin-parity:soak',
		]);
	});

	it('prints help without running any gate', function () {
		const result = spawnSync('jiti', ['scripts/admin-parity-final-gate.ts', '--help'], {
			cwd: root,
			encoding: 'utf8',
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Usage: jiti scripts/admin-parity-final-gate.ts');
		expect(result.stdout).to.contain('admin-parity:ledger step verifies that every parity ledger row is Complete');
		expect(result.stdout).to.contain('admin-decommission:audit step verifies that legacy browser/server roots');
		expect(result.stdout).to.contain('e2e parity, visual identity, and soak gates');
		expect(result.stdout).to.contain('admin-parity:soak step verifies branch protection or an active branch ruleset');
		expect(result.stdout).to.contain('inspect the required-check source');
		expect(result.stdout).to.contain('--dry-run');
		expect(result.stderr).to.equal('');
	});

	it('stops at the first failing command', function () {
		writeFakeNpm({ failOn: 'admin-parity' });

		const result = spawnSync('jiti', ['scripts/admin-parity-final-gate.ts'], {
			cwd: root,
			encoding: 'utf8',
			env: {
				...process.env,
				PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
			},
		});
		const calls = readFileSync(join(tempDir!, 'npm-calls.log'), 'utf8').trim().split('\n');

		expect(result.status).to.equal(23);
		expect(calls).to.deep.equal([
			'run admin-parity:ledger',
			'run admin-decommission:audit',
			'run lint',
			'run typecheck',
			'run build-dev',
			'run build',
			'run test:unit',
			'run test:e2e-api',
			'run admin-parity',
		]);
	});

	it('runs every final gate command when each command succeeds', function () {
		writeFakeNpm({ failOn: '' });

		const result = spawnSync('jiti', ['scripts/admin-parity-final-gate.ts'], {
			cwd: root,
			encoding: 'utf8',
			env: {
				...process.env,
				PATH: `${tempDir!}${delimiter}${process.env.PATH}`,
			},
		});
		const calls = readFileSync(join(tempDir!, 'npm-calls.log'), 'utf8').trim().split('\n');

		expect(result.status).to.equal(0);
		expect(calls).to.deep.equal([
			'run admin-parity:ledger',
			'run admin-decommission:audit',
			'run lint',
			'run typecheck',
			'run build-dev',
			'run build',
			'run test:unit',
			'run test:e2e-api',
			'run admin-parity',
			'run package:verify',
			'run admin-parity:soak',
		]);
	});

	function writeFakeNpm({ failOn }: { failOn: string }) {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-final-gate-'));
		writeFileSync(
			join(tempDir, 'npm'),
			`#!/usr/bin/env node
const { appendFileSync } = require('node:fs');
const { join } = require('node:path');
const args = process.argv.slice(2);
appendFileSync(join(${JSON.stringify(tempDir)}, 'npm-calls.log'), args.join(' ') + '\\n');
if (args.join(' ') === ${JSON.stringify(`run ${failOn}`)}) {
	process.exit(23);
}
`,
			{ mode: 0o755 },
		);
	}
});
