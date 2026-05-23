import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';
import classes from './styles.mjs';

/**
 * Renders a form label element with glamor CSS class names derived from the
 * form layout context. Reads `formFieldId`, `formLayout`, and `labelWidth`
 * from React context and merges them with the provided props.
 * @param {object} props - Component props.
 * @param {string|function(): React.Element} [props.component] - Element type or component to render; defaults to 'label'.
 * @param {boolean} [props.cropText] - When true, applies a text-cropping CSS modifier class.
 * @param {Array|object} [props.cssStyles] - Glamor style object or array of style objects to apply.
 * @param {string} [props.className] - Additional CSS class name appended after glamor classes.
 * @param {string} [props.htmlFor] - The `for` attribute value; falls back to `formFieldId` from context.
 * @param {object} context - React context.
 * @param {string} [context.formFieldId] - Field ID provided by a parent Form component.
 * @param {string} [context.formLayout] - Layout variant ('basic', 'horizontal', or 'inline').
 * @param {number|string} [context.labelWidth] - Explicit width applied as an inline style.
 * @returns {React.Element} The rendered label element.
 */
function FormLabel ({
	cssStyles,
	className,
	component: Component,
	cropText,
	htmlFor,
	...props
},
{
	formFieldId,
	formLayout,
	labelWidth,
}) {
	props.htmlFor = htmlFor || formFieldId;
	props.className = css(
		classes.FormLabel,
		formLayout ? classes['FormLabel--form-layout-' + formLayout] : null,
		cropText ? classes['FormLabel--crop-text'] : null,
		cssStyles
	);
	if (className) {
		props.className += (' ' + className);
	}
	if (labelWidth) {
		props.style = {
			width: labelWidth,
			...props.style,
		};
	}

	return <Component {...props} />;
};

const stylesShape = {
	_definition: PropTypes.object,
	_name: PropTypes.string,
};

FormLabel.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	cropText: PropTypes.bool,
	cssStyles: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(stylesShape)),
		PropTypes.shape(stylesShape),
	]),
};
FormLabel.defaultProps = {
	component: 'label',
};
FormLabel.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
	labelWidth: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

export default FormLabel;
