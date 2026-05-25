import { expect } from 'chai';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();

describe('scripts/admin-decommission-audit', function () {
	let tempDir: string | undefined;

	afterEach(function () {
		if (tempDir) {
			rmSync(tempDir, { force: true, recursive: true });
			tempDir = undefined;
		}
	});

	it('passes when the legacy browser and server roots are absent', function () {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-decommission-clean-'));
		mkdirSync(join(tempDir, 'fields/types'), { recursive: true });
		mkdirSync(join(tempDir, 'admin/client-next/src/fields'), { recursive: true });
		writeFileSync(join(tempDir, 'fields/types/TextType.mts'), '');
		writeFileSync(join(tempDir, 'admin/client-next/src/fields/index.ts'), '');

		const result = runAudit(tempDir);

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('legacy client decommission audit passed');
		expect(result.stdout).to.contain('server/model field classes: 1');
		expect(result.stdout).to.contain('modern browser field root: admin/client-next/src/fields');
		expect(result.stderr).to.equal('');
	});

	it('fails while any legacy browser or server root remains', function () {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-decommission-open-'));
		mkdirSync(join(tempDir, 'admin/client-legacy/App'), { recursive: true });
		mkdirSync(join(tempDir, 'admin/server/templates-legacy'), { recursive: true });
		mkdirSync(join(tempDir, 'admin/public-legacy'), { recursive: true });
		mkdirSync(join(tempDir, 'dist/admin/client-legacy/App'), { recursive: true });
		mkdirSync(join(tempDir, 'dist/admin/server/routes-legacy'), { recursive: true });
		mkdirSync(join(tempDir, 'dist/admin/public-legacy'), { recursive: true });
		writeFileSync(join(tempDir, 'admin/client-legacy/packages.mjs'), '');

		const result = runAudit(tempDir);

		expect(result.status).to.equal(1);
		expect(result.stdout).to.equal('');
		expect(result.stderr).to.contain('legacy client decommission audit found 7 legacy path(s):');
		expect(result.stderr).to.contain('- admin/client-legacy/App');
		expect(result.stderr).to.contain('- admin/client-legacy/packages.mjs');
		expect(result.stderr).to.contain('- admin/server/templates-legacy');
		expect(result.stderr).to.contain('- admin/public-legacy');
		expect(result.stderr).to.contain('- dist/admin/client-legacy/App');
		expect(result.stderr).to.contain('- dist/admin/server/routes-legacy');
		expect(result.stderr).to.contain('- dist/admin/public-legacy');
	});

	it('fails when server field classes are missing', function () {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-decommission-no-types-'));
		mkdirSync(join(tempDir, 'admin/client-next/src/fields'), { recursive: true });

		const result = runAudit(tempDir);

		expect(result.status).to.equal(1);
		expect(result.stdout).to.equal('');
		expect(result.stderr).to.contain('found no server/model field classes under fields/types');
	});

	it('fails when modern browser field code has no stable root', function () {
		tempDir = mkdtempSync(join(tmpdir(), 'keystone-decommission-no-modern-fields-'));
		mkdirSync(join(tempDir, 'fields/types'), { recursive: true });
		writeFileSync(join(tempDir, 'fields/types/TextType.mts'), '');

		const result = runAudit(tempDir);

		expect(result.status).to.equal(1);
		expect(result.stdout).to.equal('');
		expect(result.stderr).to.contain('found no stable modern browser field root');
		expect(result.stderr).to.contain('admin/client-next/src/fields');
	});

	it('prints help', function () {
		const result = spawnSync('jiti', ['scripts/admin-decommission-audit.ts', '--help'], {
			cwd: root,
			encoding: 'utf8',
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Usage: jiti scripts/admin-decommission-audit.ts');
		expect(result.stdout).to.contain('legacy browser/server roots named by the convergence plan');
		expect(result.stdout).to.contain('source and dist package output');
		expect(result.stdout).to.contain('server/model field classes remain');
		expect(result.stderr).to.equal('');
	});

	function runAudit(auditRoot: string) {
		return spawnSync('jiti', ['scripts/admin-decommission-audit.ts', '--root', auditRoot], {
			cwd: root,
			encoding: 'utf8',
		});
	}
});
