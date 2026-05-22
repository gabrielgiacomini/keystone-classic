/**
 * Linear Gradient
 * ==============================
 * Short-hand helper for adding a linear gradient to your component.
 * Accepts a direction, a start color, an end color and an optional base value.
 * Spread the declaration into your component class: `...linearGradient(red, blue)`.
 * @param {string} direction  CSS gradient direction (e.g. "to bottom")
 * @param {string} top        Start color
 * @param {string} bottom     End color
 * @param {string} [base]     Optional base value appended after the gradient
 * @returns {object} CSS linear gradient declaration object
 */
function linearGradient (direction, top, bottom, base = '') {
	return {
		background: `linear-gradient(${direction}, ${top} 0%, ${bottom} 100%) ${base}`,
	};
}

/**
 * Vertical Gradient
 * Short-hand helper for a top-to-bottom linear gradient.
 * @param {string} top    Start color
 * @param {string} bottom End color
 * @param {string} base   Optional base value appended after the gradient
 * @returns {object} CSS linear gradient declaration object
 */
function gradientVertical (top, bottom, base) {
	return linearGradient('to bottom', top, bottom, base);
}

/**
 * Horizontal Gradient
 * Short-hand helper for a left-to-right linear gradient.
 * @param {string} top    Start color (left side)
 * @param {string} bottom End color (right side)
 * @param {string} base   Optional base value appended after the gradient
 * @returns {object} CSS linear gradient declaration object
 */
function gradientHorizontal (top, bottom, base) {
	return linearGradient('to right', top, bottom, base);
}

/**
 * Border Radius
 * ==============================
 * Short-hand helpers for border radii.
 */

/**
 * Apply a border radius to the top two corners.
 * @param {string|number} radius The border radius value
 * @returns {object} CSS declaration object with borderTopLeftRadius and borderTopRightRadius
 */
function borderTopRadius (radius) {
	return {
		borderTopLeftRadius: radius,
		borderTopRightRadius: radius,
	};
}

/**
 * Apply a border radius to the right two corners.
 * @param {string|number} radius The border radius value
 * @returns {object} CSS declaration object with borderBottomRightRadius and borderTopRightRadius
 */
function borderRightRadius (radius) {
	return {
		borderBottomRightRadius: radius,
		borderTopRightRadius: radius,
	};
}

/**
 * Apply a border radius to the bottom two corners.
 * @param {string|number} radius The border radius value
 * @returns {object} CSS declaration object with borderBottomLeftRadius and borderBottomRightRadius
 */
function borderBottomRadius (radius) {
	return {
		borderBottomLeftRadius: radius,
		borderBottomRightRadius: radius,
	};
}

/**
 * Apply a border radius to the left two corners.
 * @param {string|number} radius The border radius value
 * @returns {object} CSS declaration object with borderBottomLeftRadius and borderTopLeftRadius
 */
function borderLeftRadius (radius) {
	return {
		borderBottomLeftRadius: radius,
		borderTopLeftRadius: radius,
	};
}

export { borderTopRadius, borderRightRadius, borderBottomRadius, borderLeftRadius, gradientHorizontal, gradientVertical };

export default {
	borderTopRadius,
	borderRightRadius,
	borderBottomRadius,
	borderLeftRadius,

	gradientHorizontal,
	gradientVertical,
};
