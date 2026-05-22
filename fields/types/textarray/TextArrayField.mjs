/**
 * @file
 * This file defines the `TextArrayField` component, which is used to render a
 * text array field in the KeystoneJS Admin UI.
 *
 * It uses the `ArrayFieldMixin` to provide the core functionality for an
 * array field.
 */
import ArrayFieldMixin from '../../mixins/ArrayField.mjs';
import Field from '../Field.mjs';

/**
 * The `TextArrayField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'TextArrayField',
	statics: {
		type: 'TextArray',
	},
	mixins: [ArrayFieldMixin],
});
