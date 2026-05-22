/**
 * Validate Hex
 * ==============================
 * Strips the leading hash if present and normalises the value to a 6-digit hex string.
 * @param {string} color A 3- or 6-digit hex color, optionally prefixed with "#"
 * @returns {string} The validated 6-digit hex string without the "#" prefix
 */
function validateHex (color) {
	const hex = color.replace('#', '');

	if (hex.length === 3) {
		return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error(`Invalid color value provided: "${color}"`);
	}

	return hex;
};

/**
 * Fade Color
 * ==============================
 * Takes a hexadecimal color, converts it to RGB and applies an alpha value.
 * @param {string} color   A hex color string (3 or 6 digits, with or without "#")
 * @param {number} opacity Opacity value from 0 to 100
 * @returns {string} An rgba() CSS color string
 */
function fade (color, opacity = 100) {
	const decimalFraction = opacity / 100;
	const hex = validateHex(color);

	// 1.
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// 2.
	const result = 'rgba('
		+ r + ','
		+ g + ','
		+ b + ','
		+ decimalFraction
		+ ')';

	return result;
};


/**
 * Shade Color
 * ==============================
 * Takes a hexadecimal color, converts it to RGB and lightens or darkens it.
 * @param {string} color   A hex color string (3 or 6 digits, with or without "#")
 * @param {number} percent Positive values lighten, negative values darken (range: -100 to 100)
 * @returns {string} The shaded hex color string prefixed with "#"
 */
function shade (color, percent) {
	const decimalFraction = percent / 100;
	const hex = validateHex(color);

	// 1.
	const f = parseInt(hex, 16);
	const t = decimalFraction < 0 ? 0 : 255;
	const p = decimalFraction < 0 ? decimalFraction * -1 : decimalFraction;

	const R = f >> 16;
	const G = f >> 8 & 0x00FF;
	const B = f & 0x0000FF;

	// 2.
	return '#' + (0x1000000
		+ (Math.round((t - R) * p) + R) * 0x10000
		+ (Math.round((t - G) * p) + G) * 0x100
		+ (Math.round((t - B) * p) + B)).toString(16).slice(1);
};

// shade helpers
const lighten = shade;
/**
 * Darkens a hex color by the given percentage.
 * @param {string} color   A hex color string (3 or 6 digits, with or without "#")
 * @param {number} percent How much to darken (0–100)
 * @returns {string} The darkened hex color string prefixed with "#"
 */
function darken (color, percent) {
	return shade(color, percent * -1);
};


/**
 * Blend Color
 * ==============================
 * Takes two hexadecimal colors and blends them together.
 * @param {string} color1  The starting hex color string (3 or 6 digits, with or without "#")
 * @param {string} color2  The ending hex color string (3 or 6 digits, with or without "#")
 * @param {number} percent Blend percentage from 0 (all color1) to 100 (all color2)
 * @returns {string} The blended hex color string prefixed with "#"
 */
function blend (color1, color2, percent) {
	const decimalFraction = percent / 100;
	const hex1 = validateHex(color1);
	const hex2 = validateHex(color2);

	// 1.
	const f = parseInt(hex1, 16);
	const t = parseInt(hex2, 16);

	const R1 = f >> 16;
	const G1 = f >> 8 & 0x00FF;
	const B1 = f & 0x0000FF;

	const R2 = t >> 16;
	const G2 = t >> 8 & 0x00FF;
	const B2 = t & 0x0000FF;

	// 2.
	return '#' + (0x1000000
		+ (Math.round((R2 - R1) * decimalFraction) + R1) * 0x10000
		+ (Math.round((G2 - G1) * decimalFraction) + G1) * 0x100
		+ (Math.round((B2 - B1) * decimalFraction) + B1)).toString(16).slice(1);
}

export { blend, darken, fade, lighten };

export default {
	blend,
	darken,
	fade,
	lighten,
};
