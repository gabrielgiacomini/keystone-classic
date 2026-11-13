import debugLib from 'debug';
import type { KeystoneList } from '../list.mjs';
import { getSecretFieldPaths, isSensitivePath } from '../security/secretFieldRedaction.mjs';

const debug = debugLib('keystone:core:list:ensureTextIndex');

/** Name prefix of the text index Keystone generates from a list's search fields. */
const GENERATED_INDEX_PREFIX = 'keystone_searchFields_textIndex_';
/** Name older Keystone versions gave the generated index. */
const LEGACY_GENERATED_INDEX_NAME = 'searchFields_text_index';
const NAMESPACE_NOT_FOUND = 26;
const INDEX_NOT_FOUND = 27;

function hashString(string: string): number {
	let hash = 0;
	if (string.length === 0) return hash;
	for (let i = 0; i < string.length; i++) {
		const char = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash;
}

type EnsureTextIndexCallback = (err?: Error | null) => void;
type MongoError = Error & { code?: number };
type IndexDescription = { name?: string; key?: Record<string, unknown>; weights?: Record<string, unknown> };
type MongoCollection = {
	indexes(): Promise<IndexDescription[]>;
	createIndex(index: Record<string, string>, options: { name: string }): Promise<unknown>;
	dropIndex(name: string): Promise<unknown>;
};
type TextIndexList = KeystoneList & {
	buildSearchTextIndex(): Record<string, string> | false;
	declaresTextIndex?: () => boolean;
	_unmanagedTextIndexCoversSecret?: boolean;
};

function sortedPaths(paths: string[]): string[] {
	return [...paths].sort((a, b) => a.localeCompare(b));
}

function generatedIndexName(paths: string[]): string {
	return GENERATED_INDEX_PREFIX + Math.abs(hashString(sortedPaths(paths).join(';')));
}

function isGeneratedIndexName(name: string): boolean {
	return name.startsWith(GENERATED_INDEX_PREFIX) || name === LEGACY_GENERATED_INDEX_NAME;
}

function isTextIndex(index: IndexDescription): boolean {
	return Boolean(index.weights) || Object.values(index.key ?? {}).includes('text');
}

// The document paths a text index covers (MongoDB reports them as its `weights`).
function textIndexPaths(index: IndexDescription): string[] {
	return Object.keys(index.weights ?? {});
}

function coversSecretPath(list: KeystoneList, paths: string[]): boolean {
	const hasSecrets = getSecretFieldPaths(list).length > 0;
	// A wildcard text index (`$**`) covers every string path, secret ones included.
	return paths.some((path) => path.includes('$**') ? hasSecrets : isSensitivePath(list, path));
}

async function listIndexes(collection: MongoCollection): Promise<IndexDescription[]> {
	try {
		return await collection.indexes();
	} catch (err) {
		// The collection does not exist yet, so it has no indexes.
		if ((err as MongoError).code === NAMESPACE_NOT_FOUND) return [];
		throw err;
	}
}

async function dropIndex(collection: MongoCollection, name: string): Promise<void> {
	try {
		await collection.dropIndex(name);
	} catch (err) {
		// Another process booting the same list already dropped it.
		if ((err as MongoError).code !== INDEX_NOT_FOUND) throw err;
	}
}

/**
 * Drops, creates or leaves the collection's text index as the list needs.
 *
 * @param list - The list whose collection is brought in sync.
 * @returns Whether a text index Keystone did not create covers a secret path.
 */
async function rebuildTextIndex(list: TextIndexList): Promise<boolean> {
	const collection = list.model.collection as unknown as MongoCollection;
	// A text index declared on the schema is created by Mongoose; Keystone then generates none.
	const declared = typeof list.declaresTextIndex === 'function' && list.declaresTextIndex();
	const wanted = declared ? false : list.buildSearchTextIndex();
	const wantedPaths = wanted ? sortedPaths(Object.keys(wanted)) : [];
	const wantedName = wanted ? generatedIndexName(wantedPaths) : null;

	let upToDate = false;
	let foreignIndexName: string | null = null;
	let dropped = false;
	let unmanagedCoversSecret = false;

	for (const index of await listIndexes(collection)) {
		if (!isTextIndex(index) || !index.name) continue;
		const paths = textIndexPaths(index);
		if (!isGeneratedIndexName(index.name)) {
			foreignIndexName = index.name;
			if (coversSecretPath(list, paths)) {
				unmanagedCoversSecret = true;
				console.warn('Keystone: text index \'' + index.name + '\' on the \'' + list.key + '\' list covers a secret field and was not created by Keystone, so it is left in place and search on this list falls back to regular expressions; drop it by hand.');
			}
			continue;
		}
		if (wantedName && index.name === wantedName && sortedPaths(paths).join(';') === wantedPaths.join(';')) {
			debug('Existing text index \'' + index.name + '\' already matches the searchFields for \'' + list.key + '\'');
			upToDate = true;
			continue;
		}
		debug('Dropping stale generated text index \'' + index.name + '\' (' + paths.join(', ') + ') for \'' + list.key + '\'');
		await dropIndex(collection, index.name);
		dropped = true;
	}
	if (!wanted || !wantedName) {
		debug('No generated text index is needed for \'' + list.key + '\'');
		const autoIndex = (list.schema as unknown as { get(key: string): unknown }).get('autoIndex');
		if (declared && dropped && autoIndex !== false) {
			// The stale generated index blocked the declared one (one text index per collection).
			await (list.model as unknown as { createIndexes(): Promise<unknown> }).createIndexes();
		}
		return unmanagedCoversSecret;
	}
	if (upToDate) return unmanagedCoversSecret;
	if (foreignIndexName) {
		console.error(
			'list.ensureTextIndex() failed to update the existing text index \'' + foreignIndexName + '\' for the \'' + list.key + '\' list.\n'
			+ 'The existing index wasn\'t automatically created by ensureTextIndex() so will not be replaced.\n'
			+ 'This may lead to unexpected behaviour when performing text searches on the this list.'
		);
		return unmanagedCoversSecret;
	}
	const result = await collection.createIndex(wanted, { name: wantedName });
	debug('collection.createIndex() result for \'' + list.key + '\':', result);
	return unmanagedCoversSecret;
}

async function syncTextIndex(list: TextIndexList): Promise<void> {
	// Fail closed: until the whole run has succeeded, what the collection's text index covers is
	// not known (a stale generated index covering a secret path may still be there), so `$text`
	// must not be used. Read by `canSearchWithTextIndex`.
	list._unmanagedTextIndexCoversSecret = true;
	const unmanagedCoversSecret = await rebuildTextIndex(list);
	// Only reached when nothing threw: the generated index is in sync.
	list._unmanagedTextIndexCoversSecret = unmanagedCoversSecret;
}

/**
 * Brings the collection's Keystone-generated `$text` index in line with the
 * list's search fields (see `buildSearchTextIndex`).
 *
 * A generated index (recognised by its name) that no longer matches is dropped
 * and, when the list still needs one, recreated. That covers an index created
 * before a search field was marked `secret`, which would otherwise keep the
 * secret value searchable; when every search field is secret, or the schema
 * declares its own text index, the stale generated index is only dropped.
 * A text index that Keystone did not create is never dropped. When it covers a
 * secret path a warning is logged and `_unmanagedTextIndexCoversSecret` is set
 * on the list, so that searches stop using `$text` (see `canSearchWithTextIndex`);
 * the flag is cleared by a later run that finds no such index.
 *
 * Fails closed: the flag is also set while a run is in progress and stays set
 * when the run fails at any step (building the wanted index definition, listing
 * the indexes for any reason other than "collection does not exist", dropping a
 * stale generated index, creating the new one), whether or not the list has
 * secret fields, because what the collection's text index covers is then
 * unknown. Search uses regular expressions until a later run succeeds.
 *
 * @param callback - Called exactly once: when the index is in sync, or with the
 * error that stopped it. An error the callback throws synchronously is logged, not
 * rethrown; so is the rejection of a promise (any thenable) the callback returns,
 * which is not awaited otherwise. Neither becomes an unhandled rejection.
 */
export default function ensureTextIndex(this: KeystoneList, callback: EnsureTextIndexCallback = function () {}): void {
	const key = this.key;
	const logCallbackError = (callbackErr: unknown): void => {
		console.error('list.ensureTextIndex() callback threw for the \'' + key + '\' list:', callbackErr);
	};
	const done = (err?: Error): void => {
		try {
			// Typed `void`, but an async callback returns a promise at run time.
			const returned = callback(err) as unknown;
			const then = (returned as { then?: unknown } | null | undefined)?.then;
			if (typeof then === 'function') {
				(then as (onFulfilled: undefined, onRejected: (reason: unknown) => void) => unknown).call(returned, undefined, logCallbackError);
			}
		} catch (callbackErr) {
			// Nothing awaits this promise chain, so a throw here would be an unhandled rejection.
			logCallbackError(callbackErr);
		}
	};
	syncTextIndex(this as TextIndexList).then(
		() => done(),
		(err: unknown) => done(err instanceof Error ? err : new Error(String(err)))
	);
}
