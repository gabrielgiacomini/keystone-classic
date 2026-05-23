import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';
import classes from './styles.mjs';
import colors from './colors.mjs';

/**
 * A labelled chip (tag) component with an optional clear button.
 *
 * Renders a div containing a primary label button and, when `onClear` is
 * provided, a secondary "×" clear button. Both buttons are styled according
 * to the `color` and `inverted` props.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class applied to the wrapper div.
 * @param {React.Node} [props.children] - Extra content rendered inside the label button after the label text.
 * @param {string} props.color - Color variant key from the colors map. Defaults to `'default'`.
 * @param {boolean} [props.inverted] - When true, uses the inverted colour style.
 * @param {string} props.label - Text displayed inside the label button.
 * @param {(event: React.SyntheticEvent) => void} [props.onClear] - Click handler for the clear button. The clear button is only rendered when this prop is provided.
 * @param {(event: React.SyntheticEvent) => void} [props.onClick] - Click handler for the label button.
 * @returns {React.Element} The rendered chip element.
 */
function Chip ({
	className,
	children,
	color,
	inverted,
	label,
	onClear,
	onClick,
	...props
}) {
	props.className = css(
		classes.chip,
		className
	);
	const labelClassName = css(
		classes.button,
		classes.label,
		classes['button__' + color + (inverted ? '__inverted' : '')]
	);
	const clearClassName = css(
		classes.button,
		classes.clear,
		classes['button__' + color + (inverted ? '__inverted' : '')]
	);

	return (
		<div {...props}>
			<button type="button" onClick={onClick} className={labelClassName}>
				{label}
				{children}
			</button>
			{!!onClear && (
				<button type="button" onClick={onClear} className={clearClassName}>
					&times;
				</button>
			)}
		</div>
	);
};

Chip.propTypes = {
	color: PropTypes.oneOf(Object.keys(colors)).isRequired,
	inverted: PropTypes.bool,
	label: PropTypes.string.isRequired,
	onClear: PropTypes.func,
	onClick: PropTypes.func,
};
Chip.defaultProps = {
	color: 'default',
};

export default Chip;
