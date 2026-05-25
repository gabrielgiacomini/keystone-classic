import { expect } from 'chai';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

import {
	getFieldComponents,
	registry,
} from '../../../dist/admin/shared/fields/registry.js';
import { registerRuntimeCustomFieldComponents } from '../../../dist/admin/shared/fields/customFields.js';

describe('scripts/build-admin-next-custom-fields', function () {
	this.timeout(30_000);

	it('prints help without requiring an entry file', function () {
		const result = spawnSync('jiti', ['scripts/build-admin-next-custom-fields.ts', '--help'], {
			cwd: process.cwd(),
			encoding: 'utf8',
		});

		expect(result.status).to.equal(0);
		expect(result.stdout).to.contain('Usage: jiti scripts/build-admin-next-custom-fields.ts');
	});

	it('builds a custom field module script from an operator entry', async function () {
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'keystone-custom-fields-'));
		const entryPath = path.join(tempDir, 'custom-fields.ts');
		const outDir = path.join(tempDir, 'dist');
		await fs.writeFile(entryPath, `
const runtime = globalThis.window ?? globalThis;
runtime.Keystone = {
  ...(runtime.Keystone ?? {}),
  legacyFieldComponents: {
    ...(runtime.Keystone?.legacyFieldComponents ?? {}),
    __customText__: {
      Field: function CustomTextField() { return null; },
      Filter: function CustomTextFilter() { return null; },
      Column: function CustomTextColumn() { return null; },
    },
  },
};
export {};
`, 'utf8');

		const result = spawnSync('jiti', [
			'scripts/build-admin-next-custom-fields.ts',
			'--entry',
			entryPath,
			'--outDir',
			outDir,
			'--fileName',
			'custom-fields.js',
			'--emptyOutDir',
		], {
			cwd: process.cwd(),
			encoding: 'utf8',
		});

		expect(result.status, result.stderr).to.equal(0);
		expect(result.stdout).to.contain('custom-fields.js');

		const output = await fs.readFile(path.join(outDir, 'custom-fields.js'), 'utf8');
		expect(output).to.contain('__customText__');
		expect(output).to.contain('legacyFieldComponents');
	});

	it('emits a runtime script that admin-next can register as legacy custom field components', async function () {
		const customType = '__customRuntimeLegacyText__';
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'keystone-custom-fields-runtime-'));
		const entryPath = path.join(tempDir, 'custom-fields.ts');
		const outDir = path.join(tempDir, 'dist');
		const outputPath = path.join(outDir, 'custom-fields.js');
		await fs.writeFile(entryPath, `
const runtime = globalThis.window ?? globalThis;
runtime.Keystone = {
  ...(runtime.Keystone ?? {}),
  legacyFieldComponents: {
    ...(runtime.Keystone?.legacyFieldComponents ?? {}),
    ${JSON.stringify(customType)}: {
      Field: function CustomRuntimeTextField() { return null; },
      Filter: function CustomRuntimeTextFilter() { return null; },
      Column: function CustomRuntimeTextColumn() { return null; },
      defaultFilterValue: '',
    },
  },
};
export {};
`, 'utf8');

		try {
			const result = spawnSync('jiti', [
				'scripts/build-admin-next-custom-fields.ts',
				'--entry',
				entryPath,
				'--outDir',
				outDir,
				'--fileName',
				'custom-fields.js',
				'--emptyOutDir',
			], {
				cwd: process.cwd(),
				encoding: 'utf8',
			});

			expect(result.status, result.stderr).to.equal(0);

			await import(`${pathToFileURL(outputPath).href}?t=${Date.now()}`);
			const registered = registerRuntimeCustomFieldComponents();
			const set = getFieldComponents(customType);

			expect(registered).to.deep.equal({ modern: [], legacy: [customType] });
			expect(set.defaultFilterValue).to.equal('');
			expect(set.Field).to.be.a('function');
			expect(set.Filter).to.be.a('function');
			expect(set.Column).to.be.a('function');
		} finally {
			Reflect.deleteProperty(registry, customType);
			delete (globalThis as { Keystone?: unknown }).Keystone;
			delete (globalThis as { window?: unknown }).window;
		}
	});
});
