import { expect } from 'chai';

import {
	buildApiFilter,
	buildApiFilters,
	buildListDownloadUrl,
	buildPageWindow,
	formatCount,
	formatFilterDisplay,
	getActiveColumnPaths,
	getDefaultColumnPaths,
	getFilterFields,
	getFilterValuesFromSearch,
	isIdColumnPath,
	parseGeopointFilterValue,
	parseDefaultColumnPaths,
	pluralizeCount,
	serializeColumnPaths,
	validateListSearch,
} from '../../../../../admin/shared/state/listRoute.ts';

describe('admin shared list route state helpers', function () {
	it('normalizes list route search params and preserves legacy columns alias', function () {
		const search = validateListSearch({
			page: '3',
			search: 'launch',
			sort: '-title',
			columns: 'title,status',
			create: 'true',
			'f.status': 'published',
			'f.state': { value: ['published', 'draft'], inverted: true },
			'f.empty': '',
			ignored: 'value',
		});

		expect(search).to.deep.equal({
			page: 3,
			search: 'launch',
			sort: '-title',
			cols: 'title,status',
			create: true,
			'f.status': 'published',
			'f.state': '{"value":["published","draft"],"inverted":true}',
		});
		expect(getFilterValuesFromSearch(search)).to.deep.equal({
			status: 'published',
			state: '{"value":["published","draft"],"inverted":true}',
		});
	});

	it('falls back to default route search values for unsupported shapes', function () {
		expect(validateListSearch({ page: 'two', search: 1, sort: false, cols: ['title'] })).to.deep.equal({
			page: 1,
			search: '',
			sort: '',
			cols: '',
		});
	});

	it('parses, serializes, and resets active column paths', function () {
		expect(getActiveColumnPaths('', ['title', 'status'])).to.deep.equal(['title', 'status']);
		expect(getActiveColumnPaths(' title, status ,, author ', ['title'])).to.deep.equal([
			'title',
			'status',
			'author',
		]);
		expect(getActiveColumnPaths('title,state', ['title'], {
			prependIdWhenExplicitColumnsOmitId: true,
		})).to.deep.equal(['id', 'title', 'state']);
		expect(getActiveColumnPaths('id,title,state', ['title'], {
			prependIdWhenExplicitColumnsOmitId: true,
		})).to.deep.equal(['id', 'title', 'state']);
		expect(serializeColumnPaths(['title', 'status'])).to.equal('title,status');
		expect(serializeColumnPaths([])).to.equal('');
	});

	it('resolves default column paths from legacy column metadata', function () {
		const fields = {
			title: { path: 'title' },
			status: { path: 'status' },
			hidden: { path: 'hidden', hidden: true },
			body: { path: 'body', nocol: true },
		};
		const resolveField = (column: string | { path?: string; field?: string; key?: string }) => {
			const path = typeof column === 'string' ? column : column.path ?? column.field ?? column.key ?? '';
			return fields[path as keyof typeof fields];
		};

		expect(parseDefaultColumnPaths(' title, status body ')).to.deep.equal(['title', 'status', 'body']);
		expect(parseDefaultColumnPaths(['title', 'status'])).to.deep.equal(['title', 'status']);
		expect(isIdColumnPath('_id')).to.equal(true);
		expect(getDefaultColumnPaths({
			columns: [{ path: 'title' }, { field: 'hidden' }],
			fields,
			resolveField,
		})).to.deep.equal(['title']);
		expect(getDefaultColumnPaths({
			defaultColumns: '_id,title',
			fields,
			resolveField,
		})).to.deep.equal(['id', 'title']);
		expect(getDefaultColumnPaths({
			defaultColumns: 'unknown',
			fields,
			resolveField,
		})).to.deep.equal(['title', 'status']);
	});

	it('builds admin download URLs with selected columns and active list state', function () {
		const url = buildListDownloadUrl({
			adminApiBasepath: '/keystone-api',
			columns: [{ path: 'title' }, { path: 'status' }],
			filters: { status: { value: 'published' } },
			format: 'csv',
			listPath: 'posts',
			origin: 'https://example.test',
			search: 'launch',
			sort: '-title',
		});

		const parsed = new URL(url);
		expect(parsed.origin).to.equal('https://example.test');
		expect(parsed.pathname).to.equal('/keystone-api/posts/export.csv');
		expect(parsed.searchParams.get('search')).to.equal('launch');
		expect(parsed.searchParams.get('sort')).to.equal('-title');
		expect(parsed.searchParams.get('select')).to.equal('title,status');
		expect(JSON.parse(parsed.searchParams.get('filters') ?? '{}')).to.deep.equal({
			status: { value: 'published' },
		});
	});

	it('formats list counts with legacy-compatible plural labels', function () {
		expect(formatCount(1200)).to.equal('1,200');
		expect(pluralizeCount(1, 'Post', 'Posts')).to.equal('1 Post');
		expect(pluralizeCount(1200, 'Post', 'Posts')).to.equal('1,200 Posts');
	});

	it('builds bounded page windows for list pagination', function () {
		expect(buildPageWindow(1, 1)).to.deep.equal([]);
		expect(buildPageWindow(3, 5, 10)).to.deep.equal([1, 2, 3, 4, 5]);
		expect(buildPageWindow(1, 30, 10)).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		expect(buildPageWindow(10, 30, 10)).to.deep.equal([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
		expect(buildPageWindow(30, 30, 10)).to.deep.equal([21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
	});

	it('serializes field filter values into the admin API filter shape', function () {
		expect(buildApiFilter({ path: 'title', fieldType: 'text' }, 'Launch')).to.deep.equal({
			mode: 'contains',
			value: 'Launch',
		});
		expect(buildApiFilter(
			{ path: 'title', fieldType: 'text' },
			JSON.stringify({ mode: 'endsWith', inverted: true, value: 'published', caseSensitive: false }),
		)).to.deep.equal({
			mode: 'endsWith',
			inverted: true,
			value: 'published',
			caseSensitive: false,
		});
		expect(buildApiFilter(
			{ path: 'title', fieldType: 'text' },
			JSON.stringify({ mode: 'exactly', inverted: false, value: '' }),
		)).to.deep.equal({
			mode: 'exactly',
			inverted: false,
			value: '',
		});
		expect(buildApiFilter(
			{ path: 'tags', fieldType: 'textarray' },
			JSON.stringify({ mode: 'beginsWith', presence: 'some', value: 'post-1' }),
		)).to.deep.equal({
			mode: 'beginsWith',
			presence: 'some',
			value: 'post-1',
		});
		expect(buildApiFilter(
			{ path: 'tags', fieldType: 'textarray' },
			JSON.stringify({ mode: 'exactly', presence: 'none', value: 'archived' }),
		)).to.deep.equal({
			mode: 'exactly',
			presence: 'none',
			value: 'archived',
		});
		expect(buildApiFilter({ path: 'rating', fieldType: 'number' }, '7')).to.deep.equal({
			mode: 'equals',
			value: 7,
		});
		expect(buildApiFilter(
			{ path: 'scoreHistory', fieldType: 'numberarray' },
			JSON.stringify({ mode: 'gt', presence: 'some', value: '20' }),
		)).to.deep.equal({
			mode: 'gt',
			presence: 'some',
			value: 20,
		});
		expect(buildApiFilter(
			{ path: 'scoreHistory', fieldType: 'numberarray' },
			JSON.stringify({ mode: 'between', presence: 'none', value: { min: '1', max: '5' } }),
		)).to.deep.equal({
			mode: 'between',
			presence: 'none',
			value: {
				min: 1,
				max: 5,
			},
		});
		expect(buildApiFilter({ path: 'status', fieldType: 'select', numeric: true }, '2')).to.deep.equal({
			value: 2,
		});
		expect(buildApiFilter(
			{ path: 'status', fieldType: 'select' },
			JSON.stringify({ value: ['published', 'draft'], inverted: true }),
		)).to.deep.equal({
			value: ['published', 'draft'],
			inverted: true,
		});
		expect(buildApiFilter(
			{ path: 'status', fieldType: 'select' },
			JSON.stringify({ value: ['published'], inverted: false }),
		)).to.deep.equal({
			value: 'published',
		});
		expect(buildApiFilter(
			{ path: 'priority', fieldType: 'select', numeric: true },
			JSON.stringify({ value: ['1', '2'], inverted: false }),
		)).to.deep.equal({
			value: [1, 2],
		});
		expect(buildApiFilter({ path: 'published', fieldType: 'boolean' }, 'false')).to.deep.equal({
			value: false,
		});
		expect(buildApiFilter({ path: 'published', fieldType: 'boolean' }, 'true')).to.deep.equal({
			value: true,
		});
		expect(buildApiFilter({ path: 'createdAt', fieldType: 'date' }, '2026-05-24')).to.deep.equal({
			mode: 'on',
			value: '2026-05-24',
		});
		expect(buildApiFilter(
			{ path: 'createdAt', fieldType: 'date' },
			JSON.stringify({ mode: 'after', value: '2026-04-30' }),
		)).to.deep.equal({
			mode: 'after',
			value: '2026-04-30',
		});
		expect(buildApiFilter(
			{ path: 'createdAt', fieldType: 'date' },
			JSON.stringify({ mode: 'between', value: { after: '2026-04-01', before: '2026-04-30' }, inverted: true }),
		)).to.deep.equal({
			mode: 'between',
			after: '2026-04-01',
			before: '2026-04-30',
			inverted: true,
		});
		expect(buildApiFilter(
			{ path: 'blackoutDates', fieldType: 'datearray' },
			JSON.stringify({ mode: 'after', presence: 'some', value: '2026-06-20' }),
		)).to.deep.equal({
			mode: 'after',
			value: '2026-06-20',
			presence: 'some',
		});
		expect(buildApiFilter(
			{ path: 'blackoutDates', fieldType: 'datearray' },
			JSON.stringify({ mode: 'between', presence: 'none', value: { after: '2026-06-01', before: '2026-06-10' } }),
		)).to.deep.equal({
			mode: 'between',
			after: '2026-06-01',
			before: '2026-06-10',
			presence: 'none',
		});
		expect(buildApiFilter(
			{ path: 'password', fieldType: 'password' },
			JSON.stringify({ exists: false }),
		)).to.deep.equal({
			exists: false,
		});
		expect(buildApiFilter({ path: 'title', fieldType: 'text' }, '')).to.equal(undefined);
		expect(buildApiFilter({ path: 'field', fieldType: '__custom__' }, 'value')).to.equal(undefined);
	});

	it('serializes geopoint and location filters into legacy-compatible API filters', function () {
		const geopoint = parseGeopointFilterValue(JSON.stringify({
			lat: '40.7484',
			lon: '-73.9857',
			distance: { mode: 'max', value: '5' },
		}));

		expect(geopoint).to.deep.equal({
			lat: 40.7484,
			lon: -73.9857,
			distance: { mode: 'max', value: 5 },
		});
		expect(buildApiFilter({ path: 'geo', fieldType: 'geopoint' }, geopoint)).to.deep.equal({
			lat: 40.7484,
			lon: -73.9857,
			distance: { mode: 'max', value: 5 },
		});
		expect(buildApiFilter({ path: 'office', fieldType: 'location' }, 'New York')).to.deep.equal({
			city: 'New York',
		});
		expect(buildApiFilter({ path: 'office', fieldType: 'location' }, JSON.stringify({
			city: 'Springfield',
			state: 'IL',
			inverted: true,
		}))).to.deep.equal({
			city: 'Springfield',
			state: 'IL',
			inverted: true,
		});
		expect(parseGeopointFilterValue('{bad json')).to.equal(undefined);
		expect(buildApiFilter({ path: 'geo', fieldType: 'geopoint' }, '{}')).to.equal(undefined);
		expect(buildApiFilter({ path: 'office', fieldType: 'location' }, JSON.stringify({
			city: '',
			state: '',
			inverted: true,
		}))).to.equal(undefined);
	});

	it('builds API filters from active filter fields only', function () {
		expect(buildApiFilters([
			{ path: 'title', fieldType: 'text' },
			{ path: 'status', fieldType: 'select' },
			{ path: 'empty', fieldType: 'text' },
		], {
			title: 'Launch',
			status: 'published',
			empty: '',
		})).to.deep.equal({
			title: { mode: 'contains', value: 'Launch' },
			status: { value: 'published' },
		});
	});

	it('selects filterable fields and formats filter chip labels', function () {
		const fields = {
			title: { path: 'title', label: 'Title', fieldType: 'text', hasFilterMethod: true },
			hidden: { path: 'hidden', label: 'Hidden', fieldType: 'text', hasFilterMethod: true, hidden: true },
			status: {
				path: 'status',
				label: 'Status',
				fieldType: 'select',
				hasFilterMethod: true,
				options: [
					{ value: 'draft', label: 'Draft' },
					{ value: 'published', label: 'Published' },
				],
			},
			body: { path: 'body', label: 'Body', fieldType: 'textarea' },
		};

		expect(getFilterFields(fields).map((field) => field.path)).to.deep.equal(['title', 'status']);
		expect(formatFilterDisplay(fields.title, JSON.stringify({ mode: 'endsWith', inverted: true, value: 'published' })))
			.to.equal('NOT Ends with: published');
		expect(formatFilterDisplay(
			{ path: 'tags', label: 'Tags', fieldType: 'textarray' },
			JSON.stringify({ mode: 'beginsWith', presence: 'some', value: 'post-1' }),
		)).to.equal('At least one element begins with: post-1');
		expect(formatFilterDisplay(
			{ path: 'scoreHistory', label: 'Score History', fieldType: 'numberarray' },
			JSON.stringify({ mode: 'gt', presence: 'some', value: '20' }),
		)).to.equal('At least one element greater than: 20');
		expect(formatFilterDisplay(fields.status, 'published')).to.equal('Published');
		expect(formatFilterDisplay(fields.status, JSON.stringify({ value: ['published', 'draft'], inverted: true })))
			.to.equal('NOT Published, Draft');
		expect(formatFilterDisplay(fields.status, 'draft')).to.equal('Draft');
		expect(formatFilterDisplay({ path: 'publishedAt', label: 'Published At', fieldType: 'date' }, JSON.stringify({ mode: 'after', value: '2026-04-30' })))
			.to.equal('After: 2026-04-30');
		expect(formatFilterDisplay(
			{ path: 'blackoutDates', label: 'Blackout Dates', fieldType: 'datearray' },
			JSON.stringify({ mode: 'after', presence: 'some', value: '2026-06-20' }),
		)).to.equal('At least one element after: 2026-06-20');
		expect(formatFilterDisplay({ path: 'password', label: 'Password', fieldType: 'password' }, JSON.stringify({ exists: false })))
			.to.equal('Is NOT Set');
		expect(formatFilterDisplay({ path: 'featured', label: 'Featured', fieldType: 'boolean' }, 'false'))
			.to.equal('Is NOT Checked');
		expect(formatFilterDisplay({ path: 'budgetCost', label: 'Budget Cost', fieldType: 'money' }, JSON.stringify({ mode: 'lt', value: '100' })))
			.to.equal('Less than: 100');
		expect(formatFilterDisplay({ path: 'venueAddress', label: 'Venue Address', fieldType: 'location' }, JSON.stringify({
			city: 'Springfield',
			state: 'IL',
		}))).to.equal('City: Springfield, State: IL');
		expect(formatFilterDisplay({ path: 'coordinates', label: 'Coordinates', fieldType: 'geopoint' }, JSON.stringify({
			lat: '40.7484',
			lon: '-73.9857',
			distance: { mode: 'max', value: '5' },
		}))).to.equal('Max distance: 5km from 40.7484, -73.9857');
	});
});
