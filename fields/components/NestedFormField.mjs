import React from 'react';
import FormField from '../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormLabel from '../../admin/client-legacy/App/elemental/FormLabel/index.mjs';
import theme from '../../admin/client-legacy/theme.mjs';

/**
 * A form field row with a small, muted label suitable for use inside nested
 * or composite field editors.
 *
 * Renders an Elemental {@link FormField} containing a {@link FormLabel} styled
 * at the theme's small font size and `gray40` colour.  On tablet-landscape
 * viewports and above a left indent of `1em` is added via a media-query style.
 * All extra props are forwarded to the underlying `FormField`.
 * @param {object} props - Component props.
 * @param {React.Node} props.children - The field input(s) rendered below the label.
 * @param {string} [props.className] - Additional CSS class names forwarded to the FormField.
 * @param {string} [props.label] - Text content of the field label.
 * @returns {React.Element} A FormField with a styled FormLabel and the provided children.
 */
function NestedFormField ({ children, className, label, ...props }) {
	return React.createElement(
		FormField,
		props,
		React.createElement(FormLabel, { cssStyles: classes.label }, label),
		children
	);
};
const classes = {
	label: {
		color: theme.color.gray40,
		fontSize: theme.font.size.small,

		[`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
			paddingLeft: '1em',
		},
	},
};

export default NestedFormField;
