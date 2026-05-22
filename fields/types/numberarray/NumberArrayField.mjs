/**
 * @file
 * This file defines the `NumberArrayField` component, which is used to render
 * a number array field in the KeystoneJS Admin UI.
 *
 * It uses the `ArrayFieldMixin` to provide the core functionality for an
 * array field, and it provides a `isValid` method to validate that the
 * input is a valid number.
 */
import ArrayFieldMixin from '../../mixins/ArrayField.mjs';
import Field from '../Field.mjs';

/**
 * The `NumberArrayField` component.
 * @augments Field
 */
export default Field.create({

	displayName: 'NumberArrayField',
	statics: {
		type: 'NumberArray',
	},

	mixins: [ArrayFieldMixin],

	/**
	 * Checks whether a value is a valid number.
	 * @param {string} input The value to check.
	 * @returns {boolean} Whether the value is a valid number.
	 */
	isValid (input) {
		return /^-?\d*\.?\d*$/.test(input);
	},

});
