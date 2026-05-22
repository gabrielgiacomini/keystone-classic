import type { KeystoneList } from '../list.mjs';
import debugLib from 'debug';
import { isValidObjectId } from '../utils/objectId.mjs';
import { escapeRegExp } from '../utils/regexp.mjs';

const debug = debugLib('keystone:core:list:addSearchToQuery');

function trim(i: string): string { return i.trim(); }
function truthy(i: unknown): boolean { return !!i; }

function getNameFilter(field: { paths: { first: string; last: string } }, searchString: string): Record<string, unknown> {
	const searchWords = searchString.split(' ').map(trim).filter(truthy).map(escapeRegExp);
	const nameSearchRegExp = new RegExp(searchWords.join('|'), 'i');
	const first: Record<string, unknown> = {}; first[field.paths.first] = nameSearchRegExp;
	const last: Record<string, unknown> = {}; last[field.paths.last] = nameSearchRegExp;
	return { $or: [first, last] };
}

function getStringFilter(path: string, searchRegExp: RegExp): Record<string, unknown> {
	const filter: Record<string, unknown> = {};
	filter[path] = searchRegExp;
	return filter;
}

export default function addSearchToQuery(this: KeystoneList, searchString: string): Record<string, unknown> {
	searchString = (searchString || '').trim();
	const query: Record<string, unknown> = {};
	let searchFilters: Record<string, unknown>[] = [];
	if (!searchString) return query;

	if (this.options.searchUsesTextIndex) {
		debug('Using text search index for value: "' + searchString + '"');
		searchFilters.push({ $text: { $search: searchString } });
		if (this.autokey) {
			const strictAutokeyFilter: Record<string, unknown> = {};
			const autokeyRegExp = new RegExp('^' + escapeRegExp(searchString));
			strictAutokeyFilter[(this.autokey as { path: string }).path] = autokeyRegExp;
			searchFilters.push(strictAutokeyFilter);
		}
	} else {
		debug('Using regular expression search for value: "' + searchString + '"');
		const searchRegExp = new RegExp(escapeRegExp(searchString), 'i');
		searchFilters = (this.searchFields as Array<{ path: string; field?: { type: string; paths: { first: string; last: string } } }>).map(function (i) {
			if (i.field?.type === 'name') {
				return getNameFilter(i.field, searchString);
			} else {
				return getStringFilter(i.path, searchRegExp);
			}
		});
		if (this.autokey) {
			const autokeyFilter: Record<string, unknown> = {};
			autokeyFilter[(this.autokey as { path: string }).path] = searchRegExp;
			searchFilters.push(autokeyFilter);
		}
	}

	if (isValidObjectId(searchString)) {
		searchFilters.push({ _id: searchString });
	}

	// Fallback: if no searchFields are configured and no autokey/id filter was
	// added, search the list's namePath field so that `?search=...` always
	// produces a meaningful query rather than an empty `{}` match-all.
	if (searchFilters.length === 0) {
		const namePath = (this.mappings.name as string | null) ?? null;
		if (namePath) {
			const nameField = this.fields[namePath] as { type?: string; paths?: { first: string; last: string } } | undefined;
			if (nameField?.type === 'name' && nameField.paths) {
				searchFilters.push(getNameFilter(nameField as { paths: { first: string; last: string } }, searchString));
			} else {
				const searchRegExp = new RegExp(escapeRegExp(searchString), 'i');
				searchFilters.push(getStringFilter(namePath, searchRegExp));
			}
		}
	}

	if (searchFilters.length > 1) {
		query.$or = searchFilters;
	} else if (searchFilters.length) {
		Object.assign(query, searchFilters[0]);
	}

	debug('Built search query for value: "' + searchString + '"', query);
	return query;
}
