import type { KeystoneList } from '../list.mjs';

const OPERATOR_NAMES: Record<string, boolean> = { gtOperator: true, ltOperator: true, btOperator: true };

type ParsedFilter = {
	key: string;
	value: string | string[];
	inverse: boolean;
	exact: boolean;
	type: string | null;
	operator: string | null;
	path?: string;
	field?: unknown;
};

function parseFilter(queryString: string): ParsedFilter {
	const parts = queryString.split(':');
	const key = parts.shift() || '';
	let inverse = false, exact = false, type: string | null = null, operator: string | null = null;
	const values: string[] = [];
	parts.forEach(function (v) {
		if (v === '!') inverse = true;
		else if (v === '=') exact = true;
		else if (v.startsWith('$')) type = v.slice(1);
		else if (OPERATOR_NAMES[v + 'Operator']) operator = v;
		else values.push(v);
	});
	return { key, value: values.length === 1 ? (values[0] ?? '') : values, inverse, exact, type, operator };
}

export default function processFilters(this: KeystoneList, q: string): Record<string, ParsedFilter> {
	const list = this;
	const filters: Record<string, ParsedFilter> = {};
	(typeof q === 'string' ? q.split(';') : []).map(parseFilter).forEach(function (filter: ParsedFilter) {
		filter.path = filter.key;
		filter.field = list.fields[filter.key];
		filters[filter.path] = filter;
	});
	return filters;
}
