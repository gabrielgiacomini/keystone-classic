import type { KeystoneList } from '../list.mjs';
import dayjs from 'dayjs';
import debugLib from 'debug';
import { isValidObjectId } from '../utils/objectId.mjs';
import { number } from '../utils/number.mjs';
import { escapeRegExp } from '../utils/regexp.mjs';

const debug = debugLib('keystone:core:list:getSearchFilters');

/** Value types accepted for date/datetime filter comparisons. */
type DateFilterValue = string | number | Date;

function filterValueToString(value: unknown): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
	if (value instanceof Date) return value.toString();
	return Object.prototype.toString.call(value);
}

/**
 * Builds combined search and admin filters for a list query.
 * @param search - The raw search string.
 * @param add - Additional admin filters to merge.
 * @returns A Mongoose-compatible filter object.
 */
export default function getSearchFilters(this: KeystoneList, search: string, add?: Record<string, unknown>): Record<string, unknown> {
	let filters: Record<string, unknown> = {};
	const list = this;

	search = (search || '').trim();

	if (search.length) {
		if (this.options.searchUsesTextIndex) {
			filters.$text = { $search: search };
		} else {
			const searchParts = search.split(' ');
			const searchRx = new RegExp(escapeRegExp(search), 'i');
			const splitSearchRx = new RegExp((searchParts.length > 1) ? searchParts.map(escapeRegExp).join('|') : escapeRegExp(search), 'i');
			const rawSearchFields = this.get('searchFields');
			const searchFieldPaths: string[] = typeof rawSearchFields === 'string'
				? rawSearchFields.split(',')
				: Array.isArray(rawSearchFields)
					? (rawSearchFields as string[])
					: [];
			const searchFilters: Record<string, unknown>[] = [];
			const searchIdField = isValidObjectId(search);

			searchFieldPaths.forEach(function (path: string) {
				path = path.trim();
				if (path === '__name__') { path = list.mappings.name ?? path; }
				const field = list.fields[path] as { type?: string; paths?: { first: string; last: string } } | undefined;
				if (field?.type === 'name' && field.paths) {
					const first: Record<string, unknown> = {}; first[field.paths.first] = splitSearchRx;
					const last: Record<string, unknown> = {}; last[field.paths.last] = splitSearchRx;
					searchFilters.push({ $or: [first, last] });
				} else {
					const filter: Record<string, unknown> = {};
					filter[path] = searchRx;
					searchFilters.push(filter);
				}
			});

			const autokey = list.autokey as { path: string } | null | undefined;
			if (autokey) {
				const akFilter: Record<string, unknown> = {};
				akFilter[autokey.path] = searchRx;
				searchFilters.push(akFilter);
			}
			if (searchIdField) {
				searchFilters.push({ _id: search });
			}
			if (searchFilters.length > 1) {
				filters.$or = searchFilters;
			} else if (searchFilters.length) {
				filters = searchFilters[0] ?? filters;
			}
		}
	}

	if (add) {
		/** Filter descriptor from the admin UI filter panel. */
interface AdminFilter {
			key: string;
			value: unknown;
			field: { type: string; many?: boolean; paths?: Record<string, string> };
			operator?: string;
			exact?: boolean;
			inverse?: boolean;
		}
		Object.values(add).forEach(function (filter: unknown) {
			const f = filter as AdminFilter;
			let cond;
			const path = f.key;
			const value = f.value;
			switch (f.field.type) {
				case 'boolean':
					if (!value || value === 'false') { filters[path] = { $ne: true }; }
					else { filters[path] = true; }
					break;
				case 'localfile': case 'cloudinaryimage': case 'cloudinaryimages': case 'name': case 'password':
					break;
					case 'location':
						['street1', 'suburb', 'state', 'postcode', 'country'].forEach(function (pathKey: string, i: number) {
							const v = (f.value as unknown[])[i];
							if (v) { filters[(f.field.paths ?? {})[pathKey] ?? pathKey] = new RegExp(escapeRegExp(filterValueToString(v)), 'i'); }
						});
						break;
				case 'relationship':
					if (value) {
						if (f.field.many) { filters[path] = (f.inverse) ? { $nin: [value] } : { $in: [value] }; }
						else { filters[path] = (f.inverse) ? { $ne: value } : value; }
					} else {
						if (f.field.many) { filters[path] = (f.inverse) ? { $not: { $size: 0 } } : { $size: 0 }; }
						else { filters[path] = (f.inverse) ? { $ne: null } : null; }
					}
					break;
				case 'select':
					if (f.value) { filters[path] = (f.inverse) ? { $ne: value } : value; }
					else { filters[path] = (f.inverse) ? { $nin: ['', null] } : { $in: ['', null] }; }
					break;
				case 'number': case 'money':
					if (f.operator === 'bt') {
						const arr = value as [unknown, unknown];
						const lo = number(arr[0]);
						const hi = number(arr[1]);
						if (!isNaN(lo) && !isNaN(hi)) { filters[path] = { $gte: lo, $lte: hi }; }
						else { filters[path] = null; }
					} else {
						const num = number(value);
						if (!isNaN(num)) {
							if (f.operator === 'gt') { filters[path] = { $gt: num }; }
							else if (f.operator === 'lt') { filters[path] = { $lt: num }; }
							else { filters[path] = num; }
						} else { filters[path] = null; }
					}
					break;
				case 'date': case 'datetime':
					if (f.operator === 'bt') {
							const arr = value as [unknown, unknown];
							const d0 = dayjs(arr[0] as DateFilterValue);
							const d1 = dayjs(arr[1] as DateFilterValue);
							if (d0.isValid() && d1.isValid()) {
								filters[path] = { $gte: d0.startOf('day').toDate(), $lte: d1.endOf('day').toDate() };
							}
						} else {
							const d = dayjs(value as DateFilterValue);
							if (d.isValid()) {
								const start = d.startOf('day').toDate();
								const end = d.endOf('day').toDate();
							if (f.operator === 'gt') { filters[path] = { $gt: end }; }
							else if (f.operator === 'lt') { filters[path] = { $lt: start }; }
							else { filters[path] = { $lte: end, $gte: start }; }
						}
					}
					break;
					case 'text': case 'textarea': case 'html': case 'email': case 'url': case 'key':
						if (f.exact) {
							if (value) {
								cond = new RegExp('^' + escapeRegExp(filterValueToString(value)) + '$', 'i');
								filters[path] = f.inverse ? { $not: cond } : cond;
							} else {
							if (f.inverse) { filters[path] = { $nin: ['', null] }; }
							else { filters[path] = { $in: ['', null] }; }
						}
						} else if (value) {
							cond = new RegExp(escapeRegExp(filterValueToString(value)), 'i');
							filters[path] = f.inverse ? { $not: cond } : cond;
						}
					break;
			}
		});
	}

	debug('Applying filters to list \'' + list.key + '\':', filters);
	return filters;
}
