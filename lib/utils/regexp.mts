const REGEXP_SPECIAL_CHARS = /[-[\]/{}()*+?.\\^$|]/g;

/**
 * Escapes special characters so a value can be embedded as a literal inside a
 * regular expression.
 *
 * @param value Value to escape.
 * @returns The escaped string, or an empty string for non-stringy empty input.
 */
export function escapeRegExp(value: unknown): string {
	let stringValue = value;
	if (
		value
		&& (
		typeof value === 'number'
		|| typeof value === 'boolean'
		|| typeof value === 'bigint'
		)
	) {
		stringValue = value.toString();
	} else if (typeof value === 'object' && value !== null) {
		const toString = (value as { toString?: unknown }).toString;
		if (typeof toString === 'function' && toString !== Object.prototype.toString) {
			stringValue = toString.call(value) as string;
		}
	}
	if (typeof stringValue !== 'string' || stringValue.length === 0) {
		return '';
	}
	return stringValue.replace(REGEXP_SPECIAL_CHARS, '\\$&');
}
