/**
 * @fileoverview
 * This file defines the `TextField` component, which is used to render a text
 * field in the KeystoneJS Admin UI.
 */
import Field from '../Field';

/**
 * The `TextField` component.
 * @extends Field
 */
module.exports = Field.create({
	displayName: 'TextField',
	statics: {
		type: 'Text',
	},
});
