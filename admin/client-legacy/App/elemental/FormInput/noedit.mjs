import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';

import theme from '../../../theme.mjs';
import { fade } from '../../../utils/color.mjs';

/* eslint quote-props: ["error", "as-needed"] */

/**
 * A read-only form input that renders its content inside a styled, non-editable
 * container element. Applies glamor CSS classes for the noedit appearance,
 * optional text cropping, optional multiline layout, and anchor-style
 * highlighting when an `href` or `onClick` prop is present.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name(s) to merge.
 * @param {string|{ (): object }} [props.component] - The element or component to render. Defaults to 'span'.
 * @param {boolean} [props.cropText] - When true, applies text-cropping styles.
 * @param {boolean} [props.multiline] - When true, applies block/multiline layout styles.
 * @param {unknown} [props.noedit] - Consumed and removed from props; not passed to the rendered element.
 * @param {string} [props.type] - Consumed and removed from props; not passed to the rendered element.
 * @returns {React.Element} The rendered component element.
 */
function FormInputNoedit ({
	className,
	component: Component,
	cropText,
	multiline,
	noedit, // NOTE not used, just removed from props
	type,
	...props
}) {
	props.className = css(
		classes.noedit,
		cropText ? classes.cropText : null,
		multiline ? classes.multiline : null,
		(props.href || props.onClick) ? classes.anchor : null,
		className
	);

	return <Component {...props} />;
};

FormInputNoedit.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	cropText: PropTypes.bool,
};
FormInputNoedit.defaultProps = {
	component: 'span',
};

const anchorHoverAndFocusStyles = {
	backgroundColor: fade(theme.color.link, 10),
	borderColor: fade(theme.color.link, 10),
	color: theme.color.link,
	outline: 'none',
	textDecoration: 'underline',
};

const classes = {
	noedit: {
		appearance: 'none',
		backgroundColor: theme.input.background.noedit,
		backgroundImage: 'none',
		borderColor: theme.input.border.color.noedit,
		borderRadius: theme.input.border.radius,
		borderStyle: 'solid',
		borderWidth: theme.input.border.width,
		color: theme.color.gray80,
		display: 'inline-block',
		lineHeight: theme.input.lineHeight,
		padding: `0 ${theme.input.paddingHorizontal}`,
		transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
		verticalAlign: 'middle',

		// prevent empty inputs from collapsing by adding content
		':empty:before': {
			color: theme.color.gray40,
			content: '"(no value)"',
		},
	},

	multiline: {
		display: 'block',
		height: 'auto',
		lineHeight: '1.4',
		paddingBottom: '0.6em',
		paddingTop: '0.6em',
	},

	// indicate clickability when using an anchor
	anchor: {
		backgroundColor: fade(theme.color.link, 5),
		borderColor: fade(theme.color.link, 10),
		color: theme.color.link,
		marginRight: 5,
		minWidth: 0,
		textDecoration: 'none',

		':hover': anchorHoverAndFocusStyles,
		':focus': anchorHoverAndFocusStyles,
	},
};

export default FormInputNoedit;
