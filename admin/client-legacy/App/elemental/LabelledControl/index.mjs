import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';
import classes from './styles.mjs';

/**
 * Renders a labelled checkbox or radio control.
 *
 * Wraps an `<input>` (checkbox or radio) and a `<span>` label inside a
 * `<label>` element so that clicking the label text activates the control.
 * When `inline` is true, an additional CSS modifier class is applied to
 * display the wrapper inline.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class passed to glamor for the wrapper.
 * @param {boolean} [props.inline] - When true, applies the inline wrapper modifier style.
 * @param {React.ReactNode} [props.label] - Content rendered inside the label `<span>`.
 * @param {string} [props.title] - HTML `title` attribute placed on the outer `<label>` element.
 * @param {'checkbox'|'radio'} props.type - Input type; must be `'checkbox'` or `'radio'`.
 * @returns {React.Element} A `<label>` element containing the input and label text.
 */
function LabelledControl ({
	className,
	inline,
	label,
	title,
	...props
}) {
	const labelClassName = css(
		classes.wrapper,
		inline && classes.wrapper__inline,
		className
	);

	return (
		<label title={title} className={labelClassName}>
			<input {...props} className={css(classes.control)} />
			<span className={css(classes.label)}>{label}</span>
		</label>
	);
};

LabelledControl.propTypes = {
	inline: PropTypes.bool,
	title: PropTypes.string,
	type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
};

export default LabelledControl;
