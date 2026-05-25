import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classes from './styles.mjs';
import ScreenReaderOnly from '../ScreenReaderOnly/index.mjs';
import colors from './colors.mjs';
import sizes from './sizes.mjs';

/**
 * Animated three-dot loading spinner with screen-reader accessible "Loading..." text.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional glamor CSS class applied to the wrapper element.
 * @param {'small'|'medium'|'large'} [props.size] - Controls the size of the spinner dots. Defaults to 'medium'.
 * @param {'danger'|'default'|'inverted'|'primary'|'success'|'warning'} [props.color] - Controls the colour of the spinner dots. Defaults to 'default'.
 * @returns {React.Element} A div containing three styled dot spans and a hidden "Loading..." label.
 */
function Spinner ({ className, size, color, ...props }) {
	props.className = css(
		classes.base,
		classes[size],
		className
	);

	return (
		<div {...props}>
			<span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__first)}`} />
			<span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__second)}`} />
			<span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__third)}`} />
			<ScreenReaderOnly>Loading...</ScreenReaderOnly>
		</div>
	);
};

Spinner.propTypes = {
	color: PropTypes.oneOf(colors),
	size: PropTypes.oneOf(sizes),
};
Spinner.defaultProps = {
	size: 'medium',
	color: 'default',
};

export default Spinner;
