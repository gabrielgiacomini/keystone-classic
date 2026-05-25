export interface ListSearch {
	page: number;
	search: string;
	sort: string;
	cols: string;
	create?: boolean;
	[filterKey: `f.${string}`]: string;
}

export interface DownloadColumn {
	path: string;
}

export interface DownloadUrlOptions {
	adminApiBasepath: string;
	columns: DownloadColumn[];
	filters: Record<string, unknown>;
	format: 'csv' | 'json';
	listPath: string;
	origin: string;
	search: string;
	sort: string;
}

export interface ListRouteFilterOption {
	value: string | number;
	label: string;
}

export interface ListRouteFilterField {
	path: string;
	label?: string;
	fieldType: string;
	numeric?: boolean;
	options?: ListRouteFilterOption[];
	hidden?: boolean;
	hasFilterMethod?: boolean;
}

interface StructuredFilterValue {
	value?: unknown;
	inverted?: boolean;
	[key: string]: unknown;
}

export type ListRouteColumnDefinition = string | {
	path?: string;
	field?: string;
	key?: string;
};

export interface DefaultColumnPathOptions<TField extends { path: string; hidden?: boolean; nocol?: boolean }> {
	columns?: ListRouteColumnDefinition[];
	defaultColumns?: string | string[];
	fields: Record<string, TField>;
	resolveField: (column: ListRouteColumnDefinition) => TField | undefined;
}

export function validateListSearch(search: Record<string, unknown>): ListSearch {
	const page = typeof search['page'] === 'number'
		? search['page']
		: typeof search['page'] === 'string' && search['page'].trim() !== ''
			? Number(search['page'])
			: 1;
	const cols = typeof search['cols'] === 'string'
		? search['cols']
		: typeof search['columns'] === 'string'
			? search['columns']
			: '';
	const result: ListSearch = {
		page: Number.isFinite(page) && page > 0 ? page : 1,
		search: typeof search['search'] === 'string' ? search['search'] : '',
		sort: typeof search['sort'] === 'string' ? search['sort'] : '',
		cols,
	};
	if (search['create'] === true || search['create'] === 'true') {
		result.create = true;
	}
	for (const [key, value] of Object.entries(search)) {
		if (key.startsWith('f.') && typeof value === 'string' && value.length > 0) {
			(result as unknown as Record<string, string>)[key] = value;
		} else if (key.startsWith('f.') && isRecord(value)) {
			(result as unknown as Record<string, string>)[key] = JSON.stringify(value);
		}
	}
	return result;
}

export function parseDefaultColumnPaths(defaultColumns: string | string[] | undefined): string[] {
	if (Array.isArray(defaultColumns)) return defaultColumns;
	if (typeof defaultColumns !== 'string') return [];
	return defaultColumns
		.split(/[,\s]+/)
		.map((part) => part.trim())
		.filter(Boolean);
}

export function isIdColumnPath(path: string): boolean {
	return path === 'id' || path === '_id';
}

export function getDefaultColumnPaths<TField extends { path: string; hidden?: boolean; nocol?: boolean }>(
	options: DefaultColumnPathOptions<TField>,
): string[] {
	const columnDefs = options.columns?.length
		? options.columns
		: parseDefaultColumnPaths(options.defaultColumns);
	const paths = columnDefs
		.map((column) => {
			const path = typeof column === 'string' ? column : column.path ?? column.field ?? column.key ?? '';
			if (typeof path === 'string' && isIdColumnPath(path.trim())) return 'id';
			const field = options.resolveField(column);
			return field !== undefined && field.hidden !== true ? field.path : undefined;
		})
		.filter((path): path is string => path !== undefined);
	if (paths.length > 0) return paths;
	return Object.values(options.fields)
		.filter((field) => field.hidden !== true && field.nocol !== true)
		.map((field) => field.path);
}

export function getFilterValuesFromSearch(search: ListSearch): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(search)) {
		if (key.startsWith('f.') && typeof value === 'string') {
			out[key.slice(2)] = value;
		}
	}
	return out;
}

export function getActiveColumnPaths(
	cols: string,
	defaultColumnPaths: string[],
	options: { prependIdWhenExplicitColumnsOmitId?: boolean } = {},
): string[] {
	if (cols.length === 0) return defaultColumnPaths;
	const paths = cols.split(',').map((path) => path.trim()).filter(Boolean);
	if (
		options.prependIdWhenExplicitColumnsOmitId === true &&
		!paths.some((path) => isIdColumnPath(path))
	) {
		return ['id', ...paths];
	}
	return paths;
}

export function serializeColumnPaths(paths: string[]): string {
	return paths.length === 0 ? '' : paths.join(',');
}

export function buildListDownloadUrl(options: DownloadUrlOptions): string {
	const url = new URL(
		`${options.adminApiBasepath}/${options.listPath}/export.${options.format}`,
		options.origin,
	);
	if (options.search) url.searchParams.set('search', options.search);
	if (Object.keys(options.filters).length > 0) {
		url.searchParams.set('filters', JSON.stringify(options.filters));
	}
	if (options.sort) url.searchParams.set('sort', options.sort);
	const selectPaths = options.columns.map((column) => column.path).join(',');
	if (selectPaths) url.searchParams.set('select', selectPaths);
	return url.toString();
}

export function formatCount(n: number): string {
	return n.toLocaleString('en-US');
}

export function pluralizeCount(count: number, singular: string, plural: string): string {
	return `${formatCount(count)} ${count === 1 ? singular : plural}`;
}

export function buildPageWindow(currentPage: number, totalPages: number, limit = 10): number[] {
	if (totalPages <= 1) return [];
	if (totalPages <= limit) return Array.from({ length: totalPages }, (_, i) => i + 1);

	const rightLimit = Math.floor(limit / 2);
	const leftLimit = rightLimit + (limit % 2) - 1;
	let minPage = currentPage - leftLimit;
	let maxPage = currentPage + rightLimit;
	if (minPage < 1) {
		maxPage = limit;
		minPage = 1;
	}
	if (maxPage > totalPages) {
		minPage = totalPages - limit + 1;
		maxPage = totalPages;
	}
	const out: number[] = [];
	for (let p = minPage; p <= maxPage; p++) out.push(p);
	return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isEmptyFilterValue(value: unknown): boolean {
	if (value === undefined || value === null || value === '') return true;
	if (value === 'any') return true;
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === 'object') return Object.keys(value).length === 0;
	return false;
}

function numberFilterValue(value: unknown): unknown {
	if (typeof value === 'number') return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : value;
	}
	return value;
}

function selectFilterValue(field: ListRouteFilterField, value: unknown): unknown {
	if (Array.isArray(value)) {
		return field.numeric === true ? value.map(numberFilterValue) : value;
	}
	return field.numeric === true ? numberFilterValue(value) : value;
}

function parseStructuredFilterValue(value: unknown): unknown {
	if (typeof value !== 'string') return value;
	const trimmed = value.trim();
	if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;
	try {
		return JSON.parse(trimmed);
	} catch {
		return value;
	}
}

function isStructuredFilterValue(value: unknown): value is StructuredFilterValue {
	return isRecord(value) && Object.prototype.hasOwnProperty.call(value, 'value');
}

function buildSelectApiFilter(field: ListRouteFilterField, value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (isEmptyFilterValue(parsed)) return undefined;
	if (isStructuredFilterValue(parsed)) {
		const rawSelectedValue = Array.isArray(parsed.value) && parsed.value.length === 1
			? parsed.value[0]
			: parsed.value;
		const selectedValue = selectFilterValue(field, rawSelectedValue);
		if (isEmptyFilterValue(selectedValue)) return undefined;
		if (parsed.inverted !== true) return { value: selectedValue };
		return {
			...parsed,
			inverted: true,
			value: selectedValue,
		};
	}
	return { value: selectFilterValue(field, parsed) };
}

function buildTextApiFilter(value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (isEmptyFilterValue(parsed)) return undefined;
	if (isStructuredFilterValue(parsed)) {
		const textValue = typeof parsed.value === 'string' ? parsed.value : String(parsed.value ?? '');
		if (textValue.length === 0 && parsed.mode !== 'exactly') return undefined;
		return {
			mode: typeof parsed.mode === 'string' ? parsed.mode : 'contains',
			inverted: parsed.inverted === true,
			value: textValue,
			...(typeof parsed.caseSensitive === 'boolean' ? { caseSensitive: parsed.caseSensitive } : {}),
		};
	}
	return { mode: 'contains', value: parsed };
}

function buildTextArrayApiFilter(value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (isEmptyFilterValue(parsed)) return undefined;
	if (isStructuredFilterValue(parsed)) {
		const textValue = typeof parsed.value === 'string' ? parsed.value : String(parsed.value ?? '');
		if (textValue.length === 0) return undefined;
		return {
			mode: typeof parsed.mode === 'string' ? parsed.mode : 'contains',
			presence: parsed.presence === 'none' ? 'none' : 'some',
			value: textValue,
			...(typeof parsed.caseSensitive === 'boolean' ? { caseSensitive: parsed.caseSensitive } : {}),
		};
	}
	return { mode: 'contains', presence: 'some', value: parsed };
}

function buildNumberApiFilter(value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (isEmptyFilterValue(parsed)) return undefined;
	if (isStructuredFilterValue(parsed)) {
		const mode = typeof parsed.mode === 'string' ? parsed.mode : 'equals';
		if (mode === 'between' && isRecord(parsed.value)) {
			return {
				mode,
				value: {
					min: numberFilterValue(parsed.value['min']),
					max: numberFilterValue(parsed.value['max']),
				},
				...(parsed.inverted === true ? { inverted: true } : {}),
			};
		}
		return {
			mode,
			value: numberFilterValue(parsed.value),
			...(parsed.inverted === true ? { inverted: true } : {}),
		};
	}
	return { mode: 'equals', value: numberFilterValue(parsed) };
}

function buildNumberArrayApiFilter(value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (isEmptyFilterValue(parsed)) return undefined;
	if (isStructuredFilterValue(parsed)) {
		const mode = typeof parsed.mode === 'string' ? parsed.mode : 'equals';
		const presence = parsed.presence === 'none' ? 'none' : 'some';
		if (mode === 'between' && isRecord(parsed.value)) {
			return {
				mode,
				presence,
				value: {
					min: numberFilterValue(parsed.value['min']),
					max: numberFilterValue(parsed.value['max']),
				},
			};
		}
		return {
			mode,
			presence,
			value: numberFilterValue(parsed.value),
		};
	}
	return { mode: 'equals', presence: 'some', value: numberFilterValue(parsed) };
}

function buildDateApiFilter(value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (isEmptyFilterValue(parsed)) return undefined;
	if (isStructuredFilterValue(parsed)) {
		const mode = typeof parsed.mode === 'string' ? parsed.mode : 'on';
		if (mode === 'between' && isRecord(parsed.value)) {
			const after = parsed.value['after'];
			const before = parsed.value['before'];
			if (isEmptyFilterValue(after) && isEmptyFilterValue(before)) return undefined;
			return {
				mode,
				after,
				before,
				...(parsed.inverted === true ? { inverted: true } : {}),
			};
		}
		if (isEmptyFilterValue(parsed.value)) return undefined;
		return {
			mode,
			value: parsed.value,
			...(parsed.inverted === true ? { inverted: true } : {}),
		};
	}
	return { mode: 'on', value: parsed };
}

function buildDateArrayApiFilter(value: unknown): Record<string, unknown> | undefined {
	const filter = buildDateApiFilter(value);
	if (filter === undefined) return undefined;
	const parsed = parseStructuredFilterValue(value);
	if (isStructuredFilterValue(parsed)) {
		filter['presence'] = parsed.presence === 'none' ? 'none' : 'some';
	}
	return filter;
}

function buildPasswordApiFilter(value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (isEmptyFilterValue(parsed)) return undefined;
	if (isRecord(parsed) && typeof parsed['exists'] === 'boolean') {
		return { exists: parsed['exists'] };
	}
	if (parsed === 'false') return { exists: false };
	return { exists: true };
}

function buildBooleanApiFilter(value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (isEmptyFilterValue(parsed)) return undefined;
	if (isStructuredFilterValue(parsed)) {
		return { value: parsed.value === true || parsed.value === 'true' };
	}
	return { value: parsed === true || parsed === 'true' };
}

export interface GeopointRouteFilterValue {
	lat: number;
	lon: number;
	distance: {
		mode: string;
		value: number | undefined;
	};
}

export function parseGeopointFilterValue(value: unknown): GeopointRouteFilterValue | undefined {
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch {
			return undefined;
		}
	}
	if (!isRecord(parsed)) return undefined;
	const lat = typeof parsed['lat'] === 'string' ? parseFloat(parsed['lat']) : Number(parsed['lat']);
	const lon = typeof parsed['lon'] === 'string' ? parseFloat(parsed['lon']) : Number(parsed['lon']);
	if (!isFinite(lat) || !isFinite(lon)) return undefined;
	const dist = isRecord(parsed['distance']) ? parsed['distance'] : {};
	const mode = typeof dist['mode'] === 'string' ? dist['mode'] : 'max';
	const rawDistVal = dist['value'];
	const distanceKm =
		rawDistVal !== '' && rawDistVal !== undefined && rawDistVal !== null
			? (typeof rawDistVal === 'string' ? parseFloat(rawDistVal) : Number(rawDistVal))
			: undefined;
	return {
		lat,
		lon,
		distance: {
			mode,
			value: distanceKm !== undefined && isFinite(distanceKm) ? distanceKm : undefined,
		},
	};
}

function buildLocationApiFilter(value: unknown): Record<string, unknown> | undefined {
	const parsed = parseStructuredFilterValue(value);
	if (typeof parsed === 'string') {
		return parsed.trim() === '' ? undefined : { city: parsed };
	}
	if (!isRecord(parsed)) return undefined;
	const filter: Record<string, unknown> = {};
	for (const key of ['street', 'city', 'state', 'code', 'country'] as const) {
		const raw = parsed[key];
		if (typeof raw === 'string' && raw.trim() !== '') filter[key] = raw;
	}
	if (Object.keys(filter).length === 0) return undefined;
	if (parsed['inverted'] === true) filter['inverted'] = true;
	return filter;
}

export function buildApiFilter(
	field: ListRouteFilterField,
	value: unknown,
): Record<string, unknown> | undefined {
	if (isEmptyFilterValue(value)) return undefined;
	switch (field.fieldType) {
		case 'boolean':
			return buildBooleanApiFilter(value);
		case 'date':
		case 'datetime':
			return buildDateApiFilter(value);
		case 'datearray':
			return buildDateArrayApiFilter(value);
		case 'geopoint': {
			const gp = parseGeopointFilterValue(value);
			if (gp === undefined) return undefined;
			return { lat: gp.lat, lon: gp.lon, distance: gp.distance };
		}
		case 'location':
			return buildLocationApiFilter(value);
		case 'money':
		case 'number':
			return buildNumberApiFilter(value);
		case 'numberarray':
			return buildNumberArrayApiFilter(value);
		case 'password':
			return buildPasswordApiFilter(value);
		case 'relationship':
			return { value };
		case 'select':
			return buildSelectApiFilter(field, value);
		case 'code':
		case 'color':
		case 'email':
		case 'html':
		case 'key':
		case 'markdown':
		case 'name':
		case 'text':
		case 'textarea':
		case 'url':
			return buildTextApiFilter(value);
		case 'textarray':
			return buildTextArrayApiFilter(value);
		default:
			return undefined;
	}
}

export function buildApiFilters(
	fields: ListRouteFilterField[],
	values: Record<string, unknown>,
): Record<string, unknown> {
	const filters: Record<string, unknown> = {};
	for (const field of fields) {
		const filter = buildApiFilter(field, values[field.path]);
		if (filter !== undefined) {
			filters[field.path] = filter;
		}
	}
	return filters;
}

export function getFilterFields<TField extends ListRouteFilterField>(
	fields: Record<string, TField> | undefined,
): TField[] {
	if (fields === undefined) return [];
	return Object.values(fields).filter(
		(field) => field.hidden !== true && field.hasFilterMethod === true,
	);
}

export function formatFilterDisplay(field: ListRouteFilterField, raw: string): string {
	if (field.fieldType === 'select' && Array.isArray(field.options)) {
		const parsed = parseStructuredFilterValue(raw);
		const inverted = isStructuredFilterValue(parsed) && parsed.inverted === true;
		const value = isStructuredFilterValue(parsed) ? parsed.value : parsed;
		const values = Array.isArray(value) ? value : [value];
		const labels = values
			.map((entry) => field.options?.find((o) => String(o.value) === String(entry))?.label ?? String(entry))
			.filter(Boolean);
		if (labels.length > 0) return `${inverted ? 'NOT ' : ''}${labels.join(', ')}`;
	}
	if (field.fieldType === 'location') {
		const parsed = parseStructuredFilterValue(raw);
		if (typeof parsed === 'string') return `City: ${parsed}`;
		if (isRecord(parsed)) {
			const labels: string[] = [];
			const fieldLabels: Record<string, string> = {
				street: 'Address',
				city: 'City',
				state: 'State',
				code: 'Postcode',
				country: 'Country',
			};
			for (const key of ['street', 'city', 'state', 'code', 'country'] as const) {
				const value = parsed[key];
				if (typeof value === 'string' && value.trim() !== '') {
					labels.push(`${fieldLabels[key]}: ${value}`);
				}
			}
			if (labels.length > 0) return `${parsed['inverted'] === true ? 'NOT ' : ''}${labels.join(', ')}`;
		}
	}
	if ([
		'code',
		'color',
		'email',
		'html',
		'key',
		'markdown',
		'name',
		'text',
		'textarea',
		'url',
	].includes(field.fieldType)) {
		const parsed = parseStructuredFilterValue(raw);
		if (isStructuredFilterValue(parsed)) {
			const modeLabels: Record<string, string> = {
				contains: 'Contains',
				exactly: 'Exactly',
				beginsWith: 'Begins with',
				endsWith: 'Ends with',
			};
			const mode = typeof parsed.mode === 'string' ? parsed.mode : 'contains';
			const value = typeof parsed.value === 'string' ? parsed.value : String(parsed.value ?? '');
			return `${parsed.inverted === true ? 'NOT ' : ''}${modeLabels[mode] ?? mode}: ${value}`;
		}
	}
	if (field.fieldType === 'textarray') {
		const parsed = parseStructuredFilterValue(raw);
		if (isStructuredFilterValue(parsed)) {
			const modeLabels: Record<string, string> = {
				contains: 'contains',
				exactly: 'is exactly',
				beginsWith: 'begins with',
				endsWith: 'ends with',
			};
			const presenceLabels: Record<string, string> = {
				some: 'At least one element',
				none: 'No element',
			};
			const mode = typeof parsed.mode === 'string' ? parsed.mode : 'contains';
			const presence = parsed.presence === 'none' ? 'none' : 'some';
			const value = typeof parsed.value === 'string' ? parsed.value : String(parsed.value ?? '');
			return `${presenceLabels[presence]} ${modeLabels[mode] ?? mode}: ${value}`;
		}
	}
	if (['money', 'number'].includes(field.fieldType)) {
		const parsed = parseStructuredFilterValue(raw);
		if (isStructuredFilterValue(parsed)) {
			const modeLabels: Record<string, string> = {
				equals: 'Exactly',
				gt: 'Greater than',
				lt: 'Less than',
				between: 'Between',
			};
			const mode = typeof parsed.mode === 'string' ? parsed.mode : 'equals';
			if (mode === 'between' && isRecord(parsed.value)) {
				return `${modeLabels[mode] ?? mode}: ${parsed.value['min'] ?? ''} - ${parsed.value['max'] ?? ''}`;
			}
			return `${modeLabels[mode] ?? mode}: ${String(parsed.value ?? '')}`;
		}
	}
	if (field.fieldType === 'numberarray') {
		const parsed = parseStructuredFilterValue(raw);
		if (isStructuredFilterValue(parsed)) {
			const modeLabels: Record<string, string> = {
				equals: 'is exactly',
				gt: 'greater than',
				lt: 'less than',
				between: 'between',
			};
			const presenceLabels: Record<string, string> = {
				some: 'At least one element',
				none: 'No element',
			};
			const mode = typeof parsed.mode === 'string' ? parsed.mode : 'equals';
			const presence = parsed.presence === 'none' ? 'none' : 'some';
			if (mode === 'between' && isRecord(parsed.value)) {
				return `${presenceLabels[presence]} ${modeLabels[mode] ?? mode}: ${parsed.value['min'] ?? ''} - ${parsed.value['max'] ?? ''}`;
			}
			return `${presenceLabels[presence]} ${modeLabels[mode] ?? mode}: ${String(parsed.value ?? '')}`;
		}
	}
	if (['date', 'datetime'].includes(field.fieldType)) {
		const parsed = parseStructuredFilterValue(raw);
		if (isStructuredFilterValue(parsed)) {
			const modeLabels: Record<string, string> = {
				on: 'On',
				after: 'After',
				before: 'Before',
				between: 'Between',
			};
			const mode = typeof parsed.mode === 'string' ? parsed.mode : 'on';
			const prefix = parsed.inverted === true ? 'NOT ' : '';
			if (mode === 'between' && isRecord(parsed.value)) {
				return `${prefix}${modeLabels[mode] ?? mode}: ${parsed.value['after'] ?? ''} - ${parsed.value['before'] ?? ''}`;
			}
			return `${prefix}${modeLabels[mode] ?? mode}: ${String(parsed.value ?? '')}`;
		}
	}
	if (field.fieldType === 'datearray') {
		const parsed = parseStructuredFilterValue(raw);
		if (isStructuredFilterValue(parsed)) {
			const modeLabels: Record<string, string> = {
				on: 'on',
				after: 'after',
				before: 'before',
				between: 'between',
			};
			const presenceLabels: Record<string, string> = {
				some: 'At least one element',
				none: 'No element',
			};
			const mode = typeof parsed.mode === 'string' ? parsed.mode : 'on';
			const presence = parsed.presence === 'none' ? 'none' : 'some';
			if (mode === 'between' && isRecord(parsed.value)) {
				return `${presenceLabels[presence]} ${modeLabels[mode] ?? mode}: ${parsed.value['after'] ?? ''} - ${parsed.value['before'] ?? ''}`;
			}
			return `${presenceLabels[presence]} ${modeLabels[mode] ?? mode}: ${String(parsed.value ?? '')}`;
		}
	}
	if (field.fieldType === 'password') {
		const parsed = parseStructuredFilterValue(raw);
		if (isRecord(parsed) && typeof parsed['exists'] === 'boolean') {
			return parsed['exists'] ? 'Is Set' : 'Is NOT Set';
		}
	}
	if (field.fieldType === 'boolean') {
		const parsed = parseStructuredFilterValue(raw);
		const value = isStructuredFilterValue(parsed) ? parsed.value : parsed;
		if (value === true || value === 'true') return 'Is Checked';
		if (value === false || value === 'false') return 'Is NOT Checked';
	}
	if (field.fieldType === 'geopoint') {
		const parsed = parseGeopointFilterValue(raw);
		if (parsed !== undefined) {
			const modeLabel = parsed.distance.mode === 'min' ? 'Min distance' : 'Max distance';
			const distance = parsed.distance.value ?? 500;
			return `${modeLabel}: ${distance}km from ${parsed.lat}, ${parsed.lon}`;
		}
	}
	return raw;
}
