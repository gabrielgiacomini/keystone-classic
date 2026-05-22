import listToArray from './listToArray.mjs';
import type { KeystoneList } from '../list.mjs';

type SortField = { path: string; getSortString?: (entry: SortEntry) => string; [key: string]: unknown };
type SortEntry = { field: SortField; invert: boolean; path: string };
type SortResult = {
	rawInput: string;
	isDefaultSort: boolean;
	input: string;
	paths: SortEntry[];
	string: string;
};

function truthy<T>(i: T | undefined | null): i is T { return !!i; }

export default function expandSort(this: KeystoneList, input: string): SortResult {
	const fields = this.fields as unknown as Record<string, SortField | undefined>;
	const sort: SortResult = {
		rawInput: input || (this.defaultSort as string),
		isDefaultSort: false,
		input: '',
		paths: [],
		string: '',
	};
	sort.input = sort.rawInput;
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = this.options.sortable ? 'sortOrder' : this.namePath;
	}
	sort.paths = listToArray(sort.input).map(function (path: string): SortEntry | undefined {
		let invert = false;
		if (path.startsWith('-')) {
			invert = true;
			path = path.slice(1);
		}
		const field = fields[path];
		if (!field) { return undefined; }
		return { field: field, invert: invert, path: field.path };
	}).filter(truthy);
	sort.string = sort.paths.map(function (i: SortEntry) {
		if (i.field.getSortString) {
			return i.field.getSortString(i);
		}
		return i.invert ? '-' + i.path : i.path;
	}).join(' ');
	return sort;
}
