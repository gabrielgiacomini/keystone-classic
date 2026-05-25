import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classes from './styles.mjs';

/**
 * Renders a styled form note (helper text) below a form field.
 *
 * Accepts either `children` or an `html` prop to set content. Providing both
 * at the same time is an error — the component logs a warning and renders the
 * `html` prop in that case.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name(s) to merge onto the root element.
 * @param {React.ReactNode} [props.children] - Child nodes rendered when `html` is not provided.
 * @param {(function(): void)|string} [props.component] - Root element type or component to render. Defaults to 'div'.
 * @param {string} [props.html] - Raw HTML string rendered via dangerouslySetInnerHTML.
 * @returns {React.Element} The rendered form note element.
 */
function FormNote ({
	className,
	children,
	component: Component,
	html,
	...props
}) {
	props.className = css(classes.note, className);

	// Property Violation
	if (children && html) {
		console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
	}

	return html ? (
		<Component {...props} dangerouslySetInnerHTML={{ __html: html }} />
	) : (
		<Component {...props}>{children}</Component>
	);
};
FormNote.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	html: PropTypes.string,
};
FormNote.defaultProps = {
	component: 'div',
};

export default FormNote;
