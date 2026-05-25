import React from 'react';
import FormInput from '../../admin/client-legacy/compat/elemental/FormInput.mjs';
import { fade } from '../../admin/client-legacy/utils/color.mjs';
import theme from '../../admin/client-legacy/theme.mjs';

/**
 * Displays a read-only form input that communicates the result of a file change.
 *
 * When `color` is not `'default'`, the background, border, and text colour are
 * tinted using the corresponding theme colour at 10 %, 30 %, and 100 % opacity
 * respectively.  Extra props are forwarded to the Elemental {@link FormInput}.
 * @param {object} props - Component props.
 * @param {object} [props.style] - Additional inline styles merged with the defaults.
 * @param {'danger'|'default'|'success'} [props.color] - Colour variant controlling
 *   the tinted appearance of the message.  Defaults to `'default'`.
 * @returns {React.Element} A non-editable FormInput styled for the chosen colour.
 */
function FileChangeMessage ({ style, color, ...props }) {
	const styles = {
		marginRight: 10,
		minWidth: 0,
		...style,
	};

	if (color !== 'default') {
		styles.backgroundColor = fade(theme.color[color], 10);
		styles.borderColor = fade(theme.color[color], 30);
		styles.color = theme.color[color];
	}

	return React.createElement(FormInput, {
		noedit: true,
		style: styles,
		...props,
	});
};

FileChangeMessage.defaultProps = {
	color: 'default',
};

export default FileChangeMessage;
