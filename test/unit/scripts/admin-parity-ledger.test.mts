import { expect } from 'chai';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();

describe('scripts/admin-parity-ledger', function () {
	let tempDir: string | undefined;

	afterEach(function () {
		if (tempDir) {
			rmSync(tempDir, { force: true, recursive: true });
			tempDir = undefined;
		}
	});

	it('passes when every workflow and field row is complete or out of scope', function () {
		const ledgerPath = writeLedger(`
# Admin Modernization Parity Ledger

## Workflow Parity

| Workflow | Legacy owner | Admin-next owner | Status | Required evidence |
| --- | --- | --- | --- | --- |
| signin | legacy | next | Complete | covered |
| custom package bridge | legacy | next | Out of scope | documented |

## Built-In Field Parity

| Field type | Legacy UI owner | Admin-next owner | Field | Filter | Column | Status |
| --- | --- | --- | --- | --- | --- | --- |
| text | legacy | next | Present | Present | Present | Complete |
`);

		const result = runLedger(ledgerPath);

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('admin parity ledger closed: 3 row(s) verified');
		expect(result.stderr).to.equal('');
	});

	it('fails while any workflow or field row remains open', function () {
		const ledgerPath = writeLedger(`
# Admin Modernization Parity Ledger

## Workflow Parity

| Workflow | Legacy owner | Admin-next owner | Status | Required evidence |
| --- | --- | --- | --- | --- |
| signin | legacy | next | In progress | missing edge |

## Built-In Field Parity

| Field type | Legacy UI owner | Admin-next owner | Field | Filter | Column | Status |
| --- | --- | --- | --- | --- | --- | --- |
| text | legacy | next | Present | Present | Present | Complete |
| file | legacy | next | Present | Present | Present | In progress |
`);

		const result = runLedger(ledgerPath);

		expect(result.status).to.equal(1);
		expect(result.stdout).to.equal('');
		expect(result.stderr).to.contain('admin parity ledger has 2 open row(s):');
		expect(result.stderr).to.contain('- Workflow Parity: signin is In progress');
		expect(result.stderr).to.contain('- Built-In Field Parity: file is In progress');
	});

	it('prints help', function () {
		const result = spawnSync('jiti', ['scripts/admin-parity-ledger.ts', '--help'], {
			cwd: root,
			encoding: 'utf8',
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Usage: jiti scripts/admin-parity-ledger.ts');
		expect(result.stdout).to.contain('Every workflow and built-in field row must be marked Complete or');
		expect(result.stderr).to.equal('');
	});

	function runLedger(ledgerPath: string) {
		return spawnSync('jiti', ['scripts/admin-parity-ledger.ts', '--ledger', ledgerPath], {
			cwd: root,
			encoding: 'utf8',
		});
	}

	function writeLedger(source: string): string {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-parity-ledger-'));
		const ledgerPath = join(tempDir, 'ledger.md');
		writeFileSync(ledgerPath, source.trimStart());
		return ledgerPath;
	}
});

