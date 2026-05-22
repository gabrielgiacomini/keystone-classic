const NON_NUMERIC_CHARS = /[^-0-9.]/g;

/**
 * Parses a human-friendly numeric value using Keystone's historical
 * `keystone-utils.number` behavior.
 *
 * @param value Number-like input.
 * @returns Parsed float, or `NaN` when no numeric content remains.
 */
export function number(value: unknown): number {
	return parseFloat(String(value).replace(NON_NUMERIC_CHARS, ''));
}
