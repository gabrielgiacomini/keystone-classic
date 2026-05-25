import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';
import theme from '../../../theme.mjs';

/**
 * Renders a centered, styled empty-state container.
 *
 * Applies blank-state theme styles (background, padding, border-radius, text
 * alignment) to the root element, and optionally renders an `<h2>` heading
 * above any child content.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name merged with the container styles.
 * @param {React.ReactNode} [props.children] - Content rendered inside the container.
 * @param {string} [props.heading] - Optional heading text rendered as an `<h2>` above children.
 * @param {((props: object) => React.Element)|string} [props.component] - Root element type or React component to render; defaults to 'div'.
 * @returns {React.Element} The rendered blank-state element.
 */
function BlankState ({
	className,
	children,
	heading,
	component: Component,
	...props
}) {
	props.className = css(
		classes.container,
		className
	);

	return (
		<Component {...props}>
			{!!heading && <h2 data-e2e-blank-state-heading className={css(classes.heading)}>{heading}</h2>}
			{children}
		</Component>
	);
};

BlankState.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]).isRequired,
	heading: PropTypes.string,
};
BlankState.defaultProps = {
	component: 'div',
};

/* eslint quote-props: ["error", "as-needed"] */

const classes = {
	container: {
		backgroundColor: theme.blankstate.background,
		borderRadius: theme.blankstate.borderRadius,
		color: theme.blankstate.color,
		paddingBottom: theme.blankstate.paddingVertical,
		paddingLeft: theme.blankstate.paddingHorizontal,
		paddingRight: theme.blankstate.paddingHorizontal,
		paddingTop: theme.blankstate.paddingVertical,
		textAlign: 'center',
	},

	heading: {
		color: 'inherit',

		':last-child': {
			marginBottom: 0,
		},
	},
};

export default BlankState;
