import { expect } from 'chai';
import {
	stringifyColumns,
	parametizeFilters,
	checkForQueryChange,
	normaliseValue,
} from '../queryParams.mjs';

describe('client utils', () => {
	describe('checkForQueryChange()', function () {
		describe('Given valid nextProps and thisProps', function () {
			describe('If nextProps.location.pathname is not the same as thisProps.location.pathname', function () {
				it('returns true', function () {
					const thisLocation = { pathname: '', query: {} };
					const active = { cachedQuery: {} };
					const newLocation = { pathname: '/hello', query: {} };
					const thisProps = { location: thisLocation };
					const nextProps = { location: newLocation, active };
					const expectedResult = true;
					const result = checkForQueryChange(nextProps, thisProps);

					expect(result).to.equal(expectedResult);
				});
			});
			describe('If the nextProps.active.cachedQuery sans search, is not the same as the nextProps.location.query sans search', function () {
				it('returns true', function () {
					const active = { cachedQuery: { filter: ['old Filter'], search: 'hello' } };
					const query = { filter: ['new Filter'], search: 'nein' };
					const location = { pathname: '/', query };
					const nextProps = { location, active };
					const thisProps = { location };
					const expectedResult = true;
					const result = checkForQueryChange(nextProps, thisProps);

					expect(result).to.equal(expectedResult);
				});
			});
			describe('If the nextProps.location.pathname is the same as thisProps.location.pathname, and the query is the same as the cached query', function () {
				it('returns false', function () {
					const active = { cachedQuery: {} };
					const location = { pathname: '/', query: {} };
					const nextProps = { location, active };
					const thisProps = { location };
					const expectedResult = false;
					const result = checkForQueryChange(nextProps, thisProps);

					expect(result).to.equal(expectedResult);
				});
			});
			describe('If the nextProps query has nested values equivalent to the cached query', function () {
				it('returns false', function () {
					const active = {
						cachedQuery: {
							page: 2,
							filters: [{ path: 'name', value: 'Ada' }],
						},
					};
					const location = {
						pathname: '/',
						query: {
							page: '2',
							filters: [{ path: 'name', value: 'Ada' }],
						},
					};
					const nextProps = { location, active };
					const thisProps = { location };
					const result = checkForQueryChange(nextProps, thisProps);

					expect(result).to.equal(false);
				});
			});
		});
	});

	describe('normaliseValue', function () {
		describe('If the value is the same as the benchmark', function () {
			it('returns undefined', function () {
				const value = 1;
				const benchmark = 1;
				const result = normaliseValue(value, benchmark);
				const expectedResult = void 0;

				expect(result).to.equal(expectedResult);
			});
		});
		describe('If the value is not the same as the benchmark', function () {
			it('returns the value', function () {
				const value = 1;
				const benchmark = 3;
				const result = normaliseValue(value, benchmark);

				expect(result).to.equal(value);
			});
		});
	});

	describe('stringifyColumns()', () => {
		const columns = [{ path: 'someColumn' }, { path: 'someOtherColumn' }];
		const defaultPathString = 'someColumn,someOtherColumn';
		it('should return if no columns are passed in', () => {
			expect(stringifyColumns()).to.equal(undefined);
		});
		it('should return a string of column names separated by commas from the object', () => {
			expect(stringifyColumns(columns)).to.equal(defaultPathString);
		});
		it('should return undefined if the column string and defaultColumnPaths match', () => {
			expect(stringifyColumns(columns, defaultPathString)).to.equal(undefined);
		});
	});

	describe('parametizeFilters()', () => {
		const singleFilter = {
			field: {
				path: 'fieldName',
				otherProp: 'name',
			},
			value: {
				valueOne: 1,
				valueTwo: 2,
				valueThree: 3,
			},
		};
		it('should return undefined if nothing is passed in', () => {
			expect(parametizeFilters()).to.equal(undefined);
		});
		it('should return undefined if an empty array is provided', () => {
			expect(parametizeFilters([])).to.equal(undefined);
		});
		const firstResult = parametizeFilters([singleFilter])[0];
		it('should return an array of flat objects with all value properties mapped to it', () => {
			expect(firstResult).to.include(singleFilter.value);
		});
		it('should return an array of flat objects with a path property', () => {
			expect(firstResult).to.have.property('path', singleFilter.field.path);
		});
		it('should not include other field properties', () => {
			expect(firstResult).to.not.have.property('otherProp');
		});
	});
});
