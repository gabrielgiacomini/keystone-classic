import debugLib from 'debug';

const debug = debugLib('keystone:core:list:ensureTextIndex');

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

import type { KeystoneList } from '../list.mjs';

type EnsureTextIndexCallback = (err?: Error | null) => void;
type MongoCollection = {
	createIndex(index: Record<string, string>, options: { name: string }, cb: (err: Error | null, result: unknown) => void): void;
	getIndexes(cb: (err: (Error & { code?: number }) | null, indexes: Record<string, [string, string][]>) => void): void;
	dropIndex(name: string, cb: (err: Error | null, result: unknown) => void): void;
};

export default function ensureTextIndex(this: KeystoneList, callback: EnsureTextIndexCallback = function () {}): void {
	const list = this;
	const collection = list.model.collection as unknown as MongoCollection;

	const textIndex = (list as KeystoneList & { buildSearchTextIndex(): Record<string, string> | false }).buildSearchTextIndex();
	if (!textIndex) {
		debug('No searchFields text index definition found for \'' + list.key + '\'; skipping text index creation');
		callback();
		return;
	}
	const fieldsHash = Math.abs(hashString(Object.keys(textIndex).sort((a, b) => a.localeCompare(b)).join(';')));
	const indexNamePrefix = 'keystone_searchFields_textIndex_';
	const newIndexName = indexNamePrefix + fieldsHash;

	const createNewIndex = function () {
		collection.createIndex(textIndex, { name: newIndexName }, function (err: Error | null, result: unknown) {
			if (err) {
				callback(err);
				return;
			}
			debug('collection.createIndex() result for \'' + list.key + '\':', result);
			callback();
		});
	};

	collection.getIndexes(function (err: (Error & { code?: number }) | null, indexes: Record<string, [string, string][]>) {
		if (err) {
			if (err.code === 26) {
				indexes = {};
			} else {
				callback(err);
				return;
			}
		}
		const indexNames = Object.keys(indexes);
		for (const existingIndexName of indexNames) {
			let isText = false;
			for (const column of (indexes[existingIndexName] ?? [])) {
				if (column[1] === 'text') isText = isText || true;
			}
			if (!isText) continue;
			if (existingIndexName === newIndexName) {
				debug('Existing text index \'' + existingIndexName + '\' already matches the searchFields for \'' + list.key + '\'');
				callback();
				return;
			}
			if (existingIndexName.startsWith(indexNamePrefix) || existingIndexName === 'searchFields_text_index') {
				debug('Existing text index \'' + existingIndexName + '\' doesn\'t match the searchFields for \'' + list.key + '\' and will be recreated as \'' + newIndexName + '\'');
				collection.dropIndex(existingIndexName, function (dropErr: Error | null, result: unknown) {
					if (dropErr) {
						callback(dropErr);
						return;
					}
					debug('collection.dropIndex() result for \'' + list.key + '\':', result);
					createNewIndex();
				});
				return;
			}
			console.error(
				'list.ensureTextIndex() failed to update the existing text index \'' + existingIndexName + '\' for the \'' + list.key + '\' list.\n'
				+ 'The existing index wasn\'t automatically created by ensureTextIndex() so will not be replaced.\n'
				+ 'This may lead to unexpected behaviour when performing text searches on the this list.'
			);
			return;
		}
		debug('No existing text index found in \'' + list.key + '\'; Creating ours now');
		createNewIndex();
	});
}
