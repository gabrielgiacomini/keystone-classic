import { expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test } from '../../fixtures/auth.js';
import { fieldCoverageManifest } from '../../fixtures/field-complete/fieldCoverageManifest.js';

interface AdminMetaField {
	path: string;
	label: string;
	fieldType: string;
	many?: boolean;
	multiple?: boolean;
}

interface AdminMetaList {
	key: string;
	path: string;
	fields: Record<string, AdminMetaField>;
	columns?: Array<{ path?: string; field?: string; key?: string }>;
}

interface AdminMeta {
	lists: Record<string, AdminMetaList>;
}

function readRepoFile (relativePath: string): string {
	return readFileSync(
		fileURLToPath(new URL(`../../../${relativePath}`, import.meta.url)),
		'utf8',
	);
}

function parseObjectKeys (source: string, objectName: string): string[] {
	const match = source.match(new RegExp(`(?:export\\s+)?const\\s+${objectName}\\s*(?::[^=]+)?=\\s*\\{([\\s\\S]*?)\\n\\};`));
	if (!match) return [];
	return [...match[1]!.matchAll(/^\s*([A-Za-z]\w*):\s/gm)]
		.map(([, key]) => key!.toLowerCase())
		.sort();
}

function manifestTypeSet (): Set<string> {
	return new Set(fieldCoverageManifest.map((entry) => entry.typeName));
}

function columnPathSet (list: AdminMetaList): Set<string> {
	return new Set(
		(list.columns ?? [])
			.map((column) => column.path ?? column.field ?? column.key)
			.filter((path): path is string => typeof path === 'string'),
	);
}

test.describe('field-complete coverage manifest', () => {
	test('classifies every runtime and admin-next field type', async () => {
		const runtimeTypes = parseObjectKeys(
			readRepoFile('dist/lib/fieldTypes.mjs'),
			'fields',
		);
		const adminNextTypes = parseObjectKeys(
			readRepoFile('admin/client-next/src/fields/registry.ts'),
			'registry',
		);
		const manifestTypes = manifestTypeSet();

		for (const typeName of new Set([...runtimeTypes, ...adminNextTypes])) {
			expect(
				manifestTypes.has(typeName),
				`${typeName} must be classified in fieldCoverageManifest`,
			).toBe(true);
		}

		for (const entry of fieldCoverageManifest) {
			if (entry.status === 'unsupported') {
				expect(entry.notes, `${entry.typeName} unsupported entry needs notes`).toBeTruthy();
			}
		}
	});

	test('maps canonical manifest entries to real admin metadata fields', async ({
		signedInPage,
	}) => {
		const res = await signedInPage.request.get('/keystone-api');
		expect(res.status()).toBe(200);
		const meta = (await res.json()) as AdminMeta;

		for (const entry of fieldCoverageManifest) {
			if (entry.status !== 'canonical') continue;
			expect(entry.listKey, `${entry.typeName} needs listKey`).toBeTruthy();
			expect(entry.path, `${entry.typeName} needs path`).toBeTruthy();

			const list = meta.lists[entry.listKey!]!;
			expect(list, `${entry.listKey} list must exist`).toBeTruthy();

			const field = list.fields[entry.path!]!;
			expect(field, `${entry.listKey}.${entry.path} field must exist`).toBeTruthy();
			expect(field.fieldType).toBe(entry.typeName);
			expect(field.label).toBe(entry.label);

			const isManyField = field.many === true || field.multiple === true;
			if (entry.variant === 'many') {
				expect(isManyField, `${entry.listKey}.${entry.path} must be many`).toBe(true);
			}
			if (entry.variant === 'single') {
				expect(isManyField, `${entry.listKey}.${entry.path} must be single`).not.toBe(true);
			}

			if (entry.supportsColumn === true) {
				expect(
					columnPathSet(list).has(entry.path!),
					`${entry.listKey}.${entry.path} must be present in default columns`,
				).toBe(true);
			}
		}
	});
});
