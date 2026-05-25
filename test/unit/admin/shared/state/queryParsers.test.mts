import { expect } from 'chai';
import sinon from 'sinon';

import {
	columnsParser,
	createFilterObject,
	filterParser,
	filtersParser,
	sortParser,
} from '../../../../../admin/shared/state/queryParsers.mjs';
import {
	deepEqual,
	isObject,
	isPlainObject,
} from '../../../../../admin/shared/state/valueGuards.mjs';

describe('admin shared query parsers', function () {
	const fields = {
		name: {
			path: 'name',
			type: 'name',
			label: 'Name',
		},
		email: {
			path: 'email',
			type: 'email',
			label: 'Email',
		},
	};

	function createList() {
		return {
			fields,
			defaultColumns: 'name,email',
			defaultSort: '-name',
			expandColumns: sinon.stub().callsFake((value: unknown) => ({ expandedColumns: value })),
			expandSort: sinon.stub().callsFake((value: unknown) => ({ expandedSort: value })),
		};
	}

	it('expands columns and sort values with legacy defaults', function () {
		const list = createList();

		expect(columnsParser(undefined, list)).to.deep.equal({ expandedColumns: list.defaultColumns });
		expect(columnsParser('email', list)).to.deep.equal({ expandedColumns: 'email' });
		expect(sortParser(undefined, list)).to.deep.equal({ expandedSort: list.defaultSort });
		expect(sortParser('email', list)).to.deep.equal({ expandedSort: 'email' });
	});

	it('parses filter arrays and stringified filter arrays into field/value pairs', function () {
		const list = createList();
		const value = { value: 'Ada', mode: 'contains', inverted: false };
		const filter = { path: 'name', ...value };
		const expected = [{ field: fields.name, value }];

		expect(filtersParser([filter], list)).to.deep.equal(expected);
		expect(filtersParser(JSON.stringify([filter]), list)).to.deep.equal(expected);
	});

	it('updates an active filter or creates a new filter for valid paths', function () {
		const list = createList();
		const originalValue = { value: 'Ada' };
		const nextValue = { value: 'Grace' };
		const activeFilters = [{ field: fields.name, value: originalValue }];

		expect(filterParser({ path: 'name', value: nextValue }, activeFilters, list)).to.deep.equal({
			field: fields.name,
			value: nextValue,
		});
		expect(filterParser({ path: 'email', value: nextValue }, activeFilters, list)).to.deep.equal({
			field: fields.email,
			value: nextValue,
		});
	});

	it('returns undefined for invalid filter paths and invalid field maps', function () {
		const value = { value: 'Ada' };
		const originalWarn = console.warn;
		console.warn = () => {};
		try {
			expect(createFilterObject('missing', value, fields)).to.equal(undefined);
			expect(createFilterObject('name', value, null)).to.equal(undefined);
		} finally {
			console.warn = originalWarn;
		}
	});

	it('provides local object guards for query parser validation', function () {
		expect(isObject({})).to.equal(true);
		expect(isObject(() => {})).to.equal(true);
		expect(isObject(null)).to.equal(false);
		expect(isPlainObject({})).to.equal(true);
		expect(isPlainObject(Object.create(null))).to.equal(true);
		expect(isPlainObject([])).to.equal(false);
	});

	it('compares nested query values without lodash', function () {
		expect(deepEqual(
			{ page: 2, filters: [{ path: 'name', value: 'Ada' }] },
			{ page: 2, filters: [{ path: 'name', value: 'Ada' }] },
		)).to.equal(true);
		expect(deepEqual(
			{ page: 2, filters: [{ path: 'name', value: 'Ada' }] },
			{ page: 2, filters: [{ path: 'name', value: 'Grace' }] },
		)).to.equal(false);
	});
});
