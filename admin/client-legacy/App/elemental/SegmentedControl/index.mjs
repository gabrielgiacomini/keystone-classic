import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classes from './styles.mjs';
import colors from './colors.mjs';

/**
 * Renders a group of buttons where exactly one option can be selected at a time.
 *
 * Each option in `options` becomes a button. The button whose `value` matches
 * the `value` prop is highlighted using the chosen `color` theme. Clicking an
 * enabled button calls `onChange` with that option's value.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class applied to the wrapper element.
 * @param {string} [props.color] - Color theme applied to the active segment. Defaults to `'default'`.
 * @param {boolean} [props.cropText] - When true, truncates button labels and shows the full label as a tooltip. Useful when `inline` and `equalWidthSegments` are both true.
 * @param {boolean} [props.equalWidthSegments] - When true, all buttons share equal width. Only relevant when `inline` is false.
 * @param {boolean} [props.inline] - When true, renders the control inline rather than full-width.
 * @param {(value: boolean|number|string) => void} props.onChange - Callback invoked with the selected option's value when a button is clicked.
 * @param {Array<{disabled: boolean, label: string, value: boolean|number|string}>} props.options - List of options to render as buttons.
 * @param {boolean|number|string} [props.value] - The currently selected value.
 * @returns {React.Element} A div containing one button per option.
 */
function SegmentedControl ({
	className,
	color,
	cropText,
	equalWidthSegments,
	inline,
	onChange,
	options,
	value,
	...props
}) {
	props.className = css(
		classes.control,
		inline ? classes.control__inline : null,
		className
	);

	return (
		<div {...props}>
			{options.map((opt) => {
				const buttonClassName = css(
					classes.button,
					opt.disabled ? classes.button__disabled : null,
					opt.value === value ? classes['button__' + color] : null,
					cropText ? classes.button__cropText : null,
					equalWidthSegments ? classes.button__equalWidth : null
				);

				return (
					<button
						className={buttonClassName}
						key={opt.value}
						onClick={!opt.disabled && (() => onChange(opt.value))}
						type="button"
						title={cropText ? opt.label : null}
						tabIndex={opt.disabled ? '-1' : ''}
					>
						{opt.label}
					</button>
				);
			})}
		</div>);
};

const valuePropShape = [
	PropTypes.bool,
	PropTypes.number,
	PropTypes.string,
];

SegmentedControl.propTypes = {
	color: PropTypes.oneOf(Object.keys(colors)),
	cropText: PropTypes.bool, // when `inline && equalWidthSegments` crops to the next largest option length
	equalWidthSegments: PropTypes.bool, // only relevant when `inline === false`
	inline: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			disabled: PropTypes.bool,
			label: PropTypes.string,
			value: PropTypes.oneOfType(valuePropShape),
		})
	).isRequired,
	value: PropTypes.oneOfType(valuePropShape),
};
SegmentedControl.defaultProps = {
	color: 'default',
};

export default SegmentedControl;
