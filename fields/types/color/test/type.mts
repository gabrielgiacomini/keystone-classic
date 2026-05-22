import { expect } from 'chai';
import ColorType from '../ColorType.mjs';
import TextType from '../../text/TextType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		color: { type: ColorType },
		nested: {
			color: { type: ColorType },
		},
	});
};

export const createData = function (_List: import('../../test-helpers.mjs').TestList) {

};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList) {

};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.color!.updateItem(testItem, {
				color: '#ffffff',
			}, function () {
				expect(testItem.color).to.equal('#ffffff');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.color']!.updateItem(testItem, {
				nested: {
					color: '#ffffff',
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).color).to.equal('#ffffff');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.color']!.updateItem(testItem, {
				'nested.color': '#ffffff',
			}, function () {
				expect((testItem.nested as Record<string, unknown>).color).to.equal('#ffffff');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		expect(List.fields.color!.validateInput === TextType.prototype.validateInput).to.be.ok;
	});

	it('should use the common text required validator', function () {
		expect(List.fields.color!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	it('should use the common text addFilterToQuery method', function () {
		expect(List.fields.color!.addFilterToQuery === TextType.prototype.addFilterToQuery).to.be.ok;
	});
};
