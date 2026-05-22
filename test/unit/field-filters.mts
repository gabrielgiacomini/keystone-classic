import fs from 'node:fs';
import path from 'node:path';
import keystone from 'keystone';
import getMongooseConnection from '../helpers/getMongooseConnection.mts';

// keystone.init(), keystone.List, keystone.mongoose, and keystone.createItems
// are internal/loosely-typed on the public interface; cast through `unknown`.
interface KsInternal {
	init(): void;
	mongoose: unknown;
	List: new (key: string, opts?: Record<string, unknown>) => KsList;
	createItems(
		items: Record<string, unknown[]>,
		cb: (err: Error | null) => void,
	): void;
}
interface KsList {
	addFiltersToQuery(filters: Record<string, unknown>): Record<string, unknown>;
	register(): void;
	model: {
		find(q: Record<string, unknown>): Promise<KsDoc[]>;
		deleteMany(q?: Record<string, unknown>): { exec(): Promise<unknown> };
	};
}
interface KsDoc extends Record<string, unknown> {}

function ks(): KsInternal {
	return keystone as unknown as KsInternal;
}

ks().init();

const typesLoc = path.resolve('dist/fields/types');
const types = fs.readdirSync(typesLoc);

let mongoose: unknown;
before(async function () {
	mongoose = await getMongooseConnection();
	ks().mongoose = mongoose;
});

function stringifyValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(stringifyValue);
	}
	if (value === undefined) return value;
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
	if ((typeof value === 'object' || typeof value === 'function') && value !== null && 'toString' in value) {
		return (value as { toString(): string }).toString();
	}
	return '';
}

for (const name of types) {
	const filtersTestPath = typesLoc + '/' + name + '/test/filters.mjs';
	if (!fs.existsSync(filtersTestPath)) continue;

	const listKey = name + 'FiltersTest';

	// nocreate option prevents warnings for required / not initial fields
	const List = new (ks().List)(listKey, { nocreate: true });
	const test = await import(filtersTestPath) as {
		initList(list: KsList): void;
		getTestItems(list: KsList, cb?: (err: Error | null, data: unknown[]) => void): unknown[] | undefined;
		testFilters(list: KsList, filter: FilterFn): void;
	};

	test.initList(List);
	List.register();

	type FilterFn = (
		filters: Record<string, unknown>,
		prop: string | ((results: KsDoc[]) => void),
		stringifyOrCb?: boolean | ((results: KsDoc[]) => void),
		callback?: (results: KsDoc[]) => void,
	) => void;

	const filter: FilterFn = function (filters, prop, stringify, callback) {
		if (typeof stringify === 'function' && !callback) {
			callback = stringify;
			stringify = false;
		}
		if (typeof prop === 'function' && !callback) {
			callback = prop;
			prop = '';
		}
		const where = List.addFiltersToQuery(filters);
		List.model.find(where).then(function (results: KsDoc[]) {
			let out: unknown = results;
			if (prop && typeof prop === 'string') {
				const mapped = results.map((result: KsDoc) => result[prop as string]);
				if (stringify) {
					out = mapped.map(stringifyValue);
				} else {
					out = mapped;
				}
			}
				(callback as (results: unknown) => void)(out);
			}).catch(function (err: unknown) {
				const error = err instanceof Error ? err : new Error(String(err));
				(callback as unknown as (results: null, err: Error) => void)(null, error);
			});
	};

	describe('FieldType: ' + name.slice(0, 1).toUpperCase() + name.slice(1) + ': Filter', function () {
		before(async function () {
			await List.model.deleteMany({}).exec();
			const testItems: Record<string, unknown[]> = {};
			if (test.getTestItems.length < 2) {
				testItems[listKey] = test.getTestItems(List) as unknown[];
			} else {
				testItems[listKey] = await new Promise<unknown[]>(function (resolve, reject) {
					test.getTestItems(List, function (err: Error | null, data: unknown[]) {
						if (err) reject(err); else resolve(data);
					});
				});
			}
			await new Promise<void>(function (resolve, reject) {
				ks().createItems(testItems, function (err: Error | null) {
					if (err) reject(err); else resolve();
				});
			});
		});
		test.testFilters(List, filter);
	});
}
