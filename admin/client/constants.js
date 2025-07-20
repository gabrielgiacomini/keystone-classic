/**
 * @fileoverview This file contains the constants used throughout the application.
 *
 * @property {object} breakpoint - The breakpoint values for different screen sizes.
 * @property {number} breakpoint.xs - The extra small breakpoint.
 * @property {number} breakpoint.sm - The small breakpoint.
 * @property {number} breakpoint.md - The medium breakpoint.
 * @property {number} breakpoint.lg - The large breakpoint.
 *
 * @property {object} borderRadius - The border radius values for different sizes.
 * @property {number} borderRadius.xs - The extra small border radius.
 * @property {number} borderRadius.sm - The small border radius.
 * @property {number} borderRadius.md - The medium border radius.
 * @property {number} borderRadius.lg - The large border radius.
 * @property {number} borderRadius.xl - The extra large border radius.
 *
 * @property {object} color - The color values for different application states.
 * @property {string} color.appDanger - The danger color.
 * @property {string} color.appInfo - The info color.
 * @property {string} color.appPrimary - The primary color.
 * @property {string} color.appSuccess - The success color.
 * @property {string} color.appWarning - The warning color.
 *
 * @property {object} spacing - The spacing values for different sizes.
 * @property {number} spacing.xs - The extra small spacing.
 * @property {number} spacing.sm - The small spacing.
 * @property {number} spacing.md - The medium spacing.
 * @property {number} spacing.lg - The large spacing.
 * @property {number} spacing.xl - The extra large spacing.
 *
 * @property {number} TABLE_CONTROL_COLUMN_WIDTH - The width of the control column in tables.
 * @property {number} NETWORK_ERROR_RETRY_DELAY - The delay in milliseconds before retrying a network request.
 */

/**
 * The breakpoint values for different screen sizes.
 * @type {{xs: number, sm: number, md: number, lg: number}}
 */
exports.breakpoint = {
	xs: 480,
	sm: 768,
	md: 992,
	lg: 1200,
};

/**
 * The border radius values for different sizes.
 * @type {{xs: number, sm: number, md: number, lg: number, xl: number}}
 */
exports.borderRadius = {
	xs: 2,
	sm: 4,
	md: 8,
	lg: 16,
	xl: 32,
};

/**
 * The color values for different application states.
 * @type {{appDanger: string, appInfo: string, appPrimary: string, appSuccess: string, appWarning: string}}
 */
exports.color = {
	appDanger: '#d64242',
	appInfo: '#56cdfc',
	appPrimary: '#1385e5',
	appSuccess: '#34c240',
	appWarning: '#fa9f47',
};

/**
 * The spacing values for different sizes.
 * @type {{xs: number, sm: number, md: number, lg: number, xl: number}}
 */
exports.spacing = {
	xs: 5,
	sm: 10,
	md: 20,
	lg: 40,
	xl: 80,
};

/**
 * The width of the control column in tables.
 * @type {number}
 */
exports.TABLE_CONTROL_COLUMN_WIDTH = 26; // icon + padding

/**
 * The delay in milliseconds before retrying a network request.
 * @type {number}
 */
exports.NETWORK_ERROR_RETRY_DELAY = 500; // in ms
