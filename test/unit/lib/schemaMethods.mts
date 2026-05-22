import { createRequire } from 'node:module';
import { expect } from 'chai';

import {
	addSchemaMethods,
	addSchemaMethodsToKeystoneList,
	type KeystoneSchemaMethodRegistrationList,
} from '../../../lib/schemaMethods.mts';
import type { KeystoneDocument } from '../../../fields/types/Type.mts';

const require = createRequire(import.meta.url);

type TestDocument = KeystoneDocument<{ title: string }>;
type TestList = KeystoneSchemaMethodRegistrationList<TestDocument>;
type TestSchemaMethod = (this: TestDocument, ...args: unknown[]) => unknown;

function createList(): TestList {
	return {
		schema: {
			methods: {} as Record<string, TestSchemaMethod>,
		},
	} as unknown as TestList;
}

describe('schemaMethods', function () {
	describe('addSchemaMethods', function () {
		it('adds instance-first methods as this-bound schema methods', function () {
			const list = createList();
			const document = { title: 'Launch' } as TestDocument;

			const result = addSchemaMethods(list, {
				displayTitle(instance: TestDocument, suffix: string) {
					return `${instance.title}${suffix}`;
				},
				hasTitle(instance: TestDocument, title: string) {
					return instance.title === title;
				},
			});

			expect(result).to.equal(list);
			expect(list.schema.methods.displayTitle!.call(document, '!')).to.equal('Launch!');
			expect(list.schema.methods.hasTitle!.call(document, 'Launch')).to.equal(true);
		});

		it('rejects non-function registrations at runtime', function () {
			const list = createList();
			const invalidMethods = {
				displayTitle: true,
			} as unknown as {
				displayTitle(instance: TestDocument): string;
			};

			expect(() => addSchemaMethods(list, invalidMethods)).to.throw(
				TypeError,
				"addSchemaMethods expected functions only; 'displayTitle' is not a function",
			);
		});
	});

	describe('addSchemaMethodsToKeystoneList', function () {
		it('keeps the cloom-style add alias as a thin wrapper', function () {
			const list = createList();
			const document = { title: 'Launch' } as TestDocument;

			const result = addSchemaMethodsToKeystoneList(list, {
				displayTitle(instance: TestDocument) {
					return instance.title;
				},
			});

			expect(result).to.equal(list);
			expect(list.schema.methods.displayTitle!.call(document)).to.equal('Launch');
		});
	});

	describe('CommonJS singleton exports', function () {
		it('exposes attached helper functions through dist/index.cjs', function () {
			const cjsKeystone = require('../../../dist/index.cjs') as {
				addFieldGroups: unknown;
				addFieldGroupsToKeystoneList: unknown;
				addSchemaMethods: unknown;
				addSchemaMethodsToKeystoneList: unknown;
				default: unknown;
				flattenFieldGroups: unknown;
				transformFieldGroupsToFields: unknown;
			};

			expect(cjsKeystone.default).to.equal(cjsKeystone);
			expect(cjsKeystone.addFieldGroups).to.be.a('function');
			expect(cjsKeystone.addFieldGroupsToKeystoneList).to.be.a('function');
			expect(cjsKeystone.flattenFieldGroups).to.be.a('function');
			expect(cjsKeystone.transformFieldGroupsToFields).to.be.a('function');
			expect(cjsKeystone.addSchemaMethods).to.be.a('function');
			expect(cjsKeystone.addSchemaMethodsToKeystoneList).to.be.a('function');
		});
	});
});
