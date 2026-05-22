/**
 * @file
 * This file defines the `TextField` component, which is used to render a text
 * field in the KeystoneJS Admin UI.
 */
import Field from '../Field.mjs';

/**
 * The `TextField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'TextField',
	statics: {
		type: 'Text',
	},
});
