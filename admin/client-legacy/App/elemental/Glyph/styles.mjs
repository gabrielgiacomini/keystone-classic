// ==============================
// Glyph
// ==============================

import colors from './colors.mjs';
import sizes from './sizes.mjs';

// Prepare variants
const colorVariants = {};
Object.keys(colors).forEach(color => {
	colorVariants[`color__${color}`] = {
		color: colors[color],
	};
});

// Prepare sizes
const sizeVariants = {};
Object.keys(sizes).forEach(size => {
	sizeVariants[`size__${size}`] = {
		fontSize: sizes[size],
	};
});

export default {
	glyph: {},

	// Colors
	...colorVariants,

	// Sizes
	...sizeVariants,
};
