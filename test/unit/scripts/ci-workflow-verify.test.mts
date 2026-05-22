import { expect } from 'chai';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();

describe('scripts/ci-workflow-verify', function () {
	let tempDir: string | undefined;

	afterEach(function () {
		if (tempDir) {
			rmSync(tempDir, { force: true, recursive: true });
			tempDir = undefined;
		}
	});

	it('verifies the repository CI workflow contract', function () {
		const result = runScript('--workflow', '.github/workflows/ci.yml');

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('CI workflow verified');
		expect(result.stdout).to.contain('admin-parity runs on the scheduled workflow');
		expect(result.stdout).to.contain('package-verify runs ci:verify, build:types, package:verify, and npm pack --dry-run');
		expect(result.stderr).to.equal('');
	});

	it('prints help without reading a workflow file', function () {
		const result = runScript('--workflow', 'missing.yml', '--help');

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Usage: jiti scripts/ci-workflow-verify.ts');
		expect(result.stdout).to.contain('--workflow');
		expect(result.stderr).to.equal('');
	});

	it('fails when admin-parity does not run the field-complete suite', function () {
		const workflowPath = writeWorkflow(minimalWorkflow().replace('      - run: npm run test:e2e-ui:fields\n', ''));
		const result = runScript('--workflow', workflowPath);

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('jobs.admin-parity must run npm run test:e2e-ui:fields');
	});

	it('fails when scheduled runs would skip admin-parity', function () {
		const workflowPath = writeWorkflow(minimalWorkflow().replace('  admin-parity:\n', "  admin-parity:\n    if: github.event_name != 'schedule'\n"));
		const result = runScript('--workflow', workflowPath);

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('jobs.admin-parity must run on scheduled events');
	});

	it('fails when package verification gates drift', function () {
		const workflowPath = writeWorkflow(minimalWorkflow().replace('      - run: npm pack --dry-run\n', ''));
		const result = runScript('--workflow', workflowPath);

		expect(result.status).to.equal(1);
		expect(result.stderr).to.contain('jobs.package-verify must run npm pack --dry-run');
	});

	function runScript(...params: string[]) {
		return spawnSync('jiti', ['scripts/ci-workflow-verify.ts', ...params], {
			cwd: root,
			encoding: 'utf8',
		});
	}

	function writeWorkflow(content: string): string {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-ci-workflow-'));
		const workflowPath = join(tempDir, 'ci.yml');
		writeFileSync(workflowPath, content);
		return workflowPath;
	}

	function minimalWorkflow() {
		return `name: CI

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:
  schedule:
    - cron: '17 8 * * *'

jobs:
  lint-typecheck:
    if: github.event_name != 'schedule'
    steps:
      - run: npm run admin-next:typecheck

  package-verify:
    if: github.event_name != 'schedule'
    steps:
      - run: npm run ci:verify
      - run: npm run build:types
      - run: npm run package:verify
      - run: npm pack --dry-run

  admin-parity:
    steps:
      - run: npm run test:e2e-ui
      - run: npm run test:e2e-ui:fields
`;
	}
});
