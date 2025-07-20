/**
 * @fileoverview
 * This file defines the `KeyField` component, which is used to render a key
 * field in the KeystoneJS Admin UI.
 *
 * It is a simple wrapper around the `Field` component.
 */
import Field from '../Field';

/**
 * The `KeyField` component.
 * @extends Field
 */
module.exports = Field.create({
	displayName: 'KeyField',
	statics: {
		type: 'Key',
	},
});
