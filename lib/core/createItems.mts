import type { Keystone } from '../../index.mjs';
import type { Callback } from '../../types/keystone-callbacks.js';
import type { FieldType, MongooseDocument } from '../../fields/types/Type.mjs';
import type RelationshipType from '../../fields/types/relationship/RelationshipType.mjs';
import debugLib from 'debug';
import { plural } from '../utils/string.mjs';

const debug = debugLib('keystone:core:createItems');

const MONGO_ID_REGEXP = /^[0-9a-fA-F]{8}[0-9a-fA-F]{6}[0-9a-fA-F]{4}[0-9a-fA-F]{6}$/;

function isMongoId(value: string): boolean {
	return MONGO_ID_REGEXP.test(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && (typeof value === 'object' || typeof value === 'function');
}

interface CreateItemsOptions {
	verbose?: boolean;
	strict?: boolean;
	refs?: Record<string, unknown> | null;
}

/**
 * Bulk-creates documents across one or more Keystone lists from a plain-object map.
 * Resolves string references to MongoDB ids across lists and supports a `refs` seed map.
 * @param data - Map of list key to array of document data objects.
 * @param ops - Optional options or callback.
 * @param callback - Called with `(err, stats)` when all items have been created.
 */
export default function createItems(
	this: Keystone,
	data: Record<string, unknown[]>,
	ops?: CreateItemsOptions | Callback<object>,
	callback?: Callback<object>
): void {
	const keystone = this;
	const options: Required<CreateItemsOptions> = {
		verbose: false,
		strict: true,
		refs: null,
	};
	const dashes = '------------------------------------------------';

	if (!isObject(data)) {
		throw new Error('keystone.createItems() requires a data object as the first argument.');
	}

	if (isObject(ops) && typeof ops !== 'function') {
		Object.assign(options, ops);
	} else if (typeof ops === 'function') {
		callback = ops;
	}

	interface ListStats {
		singular: string;
		plural: string;
		created: number;
		warnings: number;
		message?: string;
	}

	/** Minimal Mongoose document shape used internally by createItems. */
	interface KeystoneDoc extends MongooseDocument {
		id: string;
		save(): Promise<void>;
	}

	const lists = Object.keys(data);
	const refs: Record<string, Record<string, unknown>> = (options.refs as Record<string, Record<string, unknown>> | null) ?? {};
	const stats: Record<string, ListStats> = {};

	function writeLog(msg: string) {
		console.log(keystone.get('name') + ': ' + msg);
	}

	function updateFieldOnDoc(doc: MongooseDocument, itemData: Record<string, unknown>) {
		return function (field: unknown) {
			const f = field as FieldType;
			if (f.type === 'relationship') return Promise.resolve();
			return new Promise<void>(function (resolve) {
				f.updateItem(doc, itemData, resolve);
			});
		};
	}

	function onSaveError(key: string, itemData: Record<string, unknown>) {
		return function (err: unknown) {
			const e = err instanceof Error ? err : new Error(String(err));
			(e as Error & { model?: string; data?: unknown }).model = key;
			(e as Error & { model?: string; data?: unknown }).data = itemData;
			debug('error saving ' + key, e);
			return Promise.reject(e);
		};
	}

	(async function () {

		// Step 1: create items for each list in series
		for (const key of lists) {
			const list = keystone.lists[key];

			if (!list) {
				if (options.strict) {
					throw Object.assign(new Error('List key ' + key + ' is invalid.'), { type: 'invalid list' });
				}
				if (options.verbose) {
					writeLog('Skipping invalid list: ' + key);
				}
				continue;
			}

			const items = data[key] ?? [];
			const relationshipPaths = Object.values(list.fields).filter((field: FieldType) => field.type === 'relationship').map((field: FieldType) => field.path);

			if (!refs[list.key]) {
				refs[list.key] = {};
			}

			const listStats = {
				singular: list.singular,
				plural: list.plural,
				created: 0,
				warnings: 0,
			};
			stats[list.key] = listStats;

			let itemsProcessed = 0;
			const totalItems = items.length;

			if (options.verbose) {
				writeLog(dashes);
				writeLog('Processing list: ' + key + ' (' + totalItems + ' items)');
				writeLog(dashes);
			}

			for (const itemData of items as Record<string, unknown>[]) {
				itemsProcessed++;

				Object.entries(itemData).forEach(function ([field, value]) {
					if (typeof value === 'function' && !relationshipPaths.includes(field)) {
						itemData[field] = (value as () => unknown)();
					}
				});

				const doc = new list.model() as unknown as KeystoneDoc;
				itemData.__doc = doc;
				if (typeof itemData.__ref === 'string') {
					const listRefs = refs[list.key] ??= {};
					listRefs[itemData.__ref] = doc;
				}

				await Promise.all(list.fieldsArray.map(updateFieldOnDoc(doc, itemData)));

				if (options.verbose) {
					writeLog('Creating item ' + itemsProcessed + ' of ' + totalItems + ': ' + list.getDocumentName(doc as unknown as Record<string, unknown>));
				}
				await doc.save().then(function () {
					listStats.created++;
				}).catch(onSaveError(key, itemData));
			}
		}

		// Step 2: process relationships for each list in parallel
		await Promise.all(lists.map(async function (key: string) {
			const list = keystone.lists[key];

			if (!list) return;

			const items = data[key] ?? [];
			const relationships = Object.values(list.fields).filter((field: FieldType): field is RelationshipType => field.type === 'relationship');

			if (!relationships.length) return;

			let itemsProcessed = 0;
			const totalItems = items.length;

			if (options.verbose) {
				writeLog(dashes);
				writeLog('Processing relationships for: ' + key + ' (' + totalItems + ' items)');
				writeLog(dashes);
			}

				await Promise.all(items.map(async function (rawSrcData: unknown) {
					const srcData = rawSrcData as Record<string, unknown>;
				const doc = srcData.__doc as KeystoneDoc;
				let relationshipsUpdated = 0;
				itemsProcessed++;

				if (options.verbose) {
					writeLog('Processing item ' + itemsProcessed + ' of ' + totalItems + ': ' + list.getDocumentName(doc as unknown as Record<string, unknown>));
				}

				await Promise.all(relationships.map(async function (field: RelationshipType) {
					const fieldValue = srcData[field.path];
					if (!fieldValue) return;

					const refsLookup = refs[field.refList.key];

					function processRef(ref: unknown): Promise<unknown> {
						if (typeof ref === 'function') {
							const match = /^function\s*[^\(]*\(\s*([^\)]*)\)/m.exec(ref.toString());
							const query = (ref as (...args: unknown[]) => { exec(): Promise<unknown> }).apply(keystone, (match?.[1] ?? '').split(',').map(function (i: string) {
								return keystone.lists[i.trim()];
							}));
							return query.exec();
						} else if (typeof ref === 'string' && isMongoId(ref)) {
							return Promise.resolve(ref);
						} else if (typeof ref === 'string' && refsLookup?.[ref]) {
							return Promise.resolve((refsLookup[ref] as KeystoneDoc).id);
						} else {
							return options.strict
								? Promise.reject(Object.assign(new Error('Invalid reference: ' + String(ref)), { type: 'invalid ref' }))
								: Promise.resolve(undefined);
						}
					}

					let result;
					if (Array.isArray(fieldValue)) {
						if (!field.many) {
							throw Object.assign(new Error('Array provided for single-value relationship.'), { type: 'invalid data' });
						}
						result = await Promise.all(fieldValue.map(processRef));
						relationshipsUpdated++;
						doc.set(field.path, result.filter(Boolean));
					} else {
						result = await processRef(fieldValue);
						relationshipsUpdated++;
						doc.set(field.path, field.many ? [result] : result);
					}
				}));

				if (options.verbose && relationshipsUpdated) {
					writeLog('Populated ' + plural(relationshipsUpdated, '* relationship', '* relationships') + '.');
				}
				if (relationshipsUpdated) {
					await doc.save();
				}
			}));
		}));

	}()).then(function () {
		let msg = '\nSuccessfully created:\n';
		Object.values(stats).forEach(function (listStats) {
			msg += '\n*   ' + plural(listStats.created, '* ' + listStats.singular, '* ' + listStats.plural);
			if (listStats.warnings) {
				msg += '\n    ' + plural(listStats.warnings, '* warning', '* warnings');
			}
		});
		const result: Record<string, ListStats> & { message?: string } = stats;
		result.message = msg + '\n';

		if (callback) callback(null, result);
	}, function (err: unknown) {
		console.error(err);
		if (err instanceof Error && err.stack) {
			console.trace(err.stack);
		}
		if (callback) callback(err instanceof Error ? err : new Error(String(err)));
	});
}
