import { pluralize, singularize } from './inflect.mjs';

/**
 * Crops a value using Keystone's historical `keystone-utils.cropString`
 * behavior.
 *
 * @param value Value to crop.
 * @param length Maximum character length before optional word preservation.
 * @param append Suffix appended only when the value was actually shortened; if
 * a boolean is passed here it is treated as `preserveWords`.
 * @param preserveWords When true, extends the crop to the end of the current word.
 * @returns Cropped string, or an empty string for non-stringy empty input.
 */
export function cropString(value: unknown, length: number, append?: string | boolean | null, preserveWords?: boolean): string {
	let stringValue = value;
	if (value) {
		const toString = (value as { toString?: unknown }).toString;
		if (typeof toString === 'function') {
			stringValue = toString.call(value) as string;
		}
	}
	if (typeof stringValue !== 'string' || stringValue.length === 0) {
		return '';
	}
	let suffix = append;
	let keepWords = preserveWords;
	if (typeof suffix === 'boolean') {
		keepWords = suffix;
		suffix = null;
	}
	if (stringValue.length <= length) return stringValue;
	let cropTo = length;
	if (keepWords) {
		const remainder = stringValue.substring(cropTo);
		const word = remainder.match(/^\w+/);
		if (word?.length) {
			cropTo += word[0].length;
		}
	}
	const cropped = stringValue.substring(0, cropTo);
	return cropped.length < stringValue.length && suffix ? cropped + suffix : cropped;
}

function upcase(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function stringifySafeValue(value: unknown): string {
	if (typeof value === 'string') {
		return value;
	}
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
		return value.toString();
	}
	if (typeof value === 'object' && value !== null) {
		const toString = (value as { toString?: unknown }).toString;
		if (typeof toString === 'function' && toString !== Object.prototype.toString) {
			return toString.call(value) as string;
		}
	}
	return '';
}

/**
 * Converts a field or key path into Keystone's historical human label form.
 *
 * @param value Value to label.
 * @returns Human-readable label text.
 */
export function keyToLabel(value: unknown): string {
	let stringValue = value;
	const toString = (value as { toString?: unknown } | null | undefined)?.toString;
	if (value && typeof toString === 'function') {
		stringValue = toString.call(value) as string;
	}
	if (typeof stringValue !== 'string' || stringValue.length === 0) {
		return '';
	}
	const spaced = stringValue
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/(\d)([a-zA-Z])/g, '$1 $2')
		.replace(/([a-zA-Z])(\d)/g, '$1 $2');
	const parts = spaced.split(/\s|\.|_|-|:|;|([A-z\u00C0-\u00ff]+)/);
	return parts
		.filter(Boolean)
		.map(part => (/^[A-Z0-9]+$/.test(part) ? part : upcase(part)))
		.join(' ');
}

/**
 * Converts a string to its singular form using Keystone's historical inflector.
 *
 * @param value Value to singularize.
 * @returns Singular form of the value.
 */
export function singular(value: string): string {
	return singularize(value);
}

/**
 * Pluralizes a word or formats a counted singular/plural template.
 *
 * @param count Word to pluralize, count value, array-like object, or object map.
 * @param singularTemplate Singular display template. `*` is replaced by count.
 * @param pluralTemplate Optional plural display template. `*` is replaced by count.
 * @returns Pluralized word or formatted count string.
 */
export function plural(count: unknown, singularTemplate?: string, pluralTemplate?: string): string {
	if (arguments.length === 1) {
		return pluralize(count as string);
	}
	let singularValue = singularTemplate;
	if (typeof singularValue !== 'string') {
		singularValue = '';
	}
	let pluralValue = pluralTemplate;
	if (!pluralValue) {
		pluralValue = pluralize(singularValue);
	}
	let countValue: unknown = count;
	if (typeof countValue === 'string') {
		countValue = Number(countValue);
	} else if (typeof countValue !== 'number') {
		countValue = Object.keys(countValue as object).length;
	}
	return (countValue === 1 ? singularValue : pluralValue).replace('*', String(countValue));
}

/**
 * Lowercases the first character of a value using Keystone's legacy behavior.
 *
 * @param value Value to downcase.
 * @returns Value with the first character lowercased, or an empty string.
 */
export function downcase(value: unknown): string {
	let stringValue = value;
	const toString = (value as { toString?: unknown } | null | undefined)?.toString;
	if (value && typeof toString === 'function') {
		stringValue = toString.call(value) as string;
	}
	if (typeof stringValue !== 'string' || stringValue.length === 0) {
		return '';
	}
	return stringValue.substring(0, 1).toLowerCase() + stringValue.substring(1);
}

/**
 * Generates a URL-safe slug using Keystone's legacy field key defaults.
 *
 * @param value Value to slugify.
 * @param separator Separator used between words.
 * @param _options Legacy slug options accepted for compatibility.
 * @param _options.locale Legacy locale hint accepted for compatibility.
 * @returns Lowercase slug text.
 */
export function slug(value: unknown, separator = '-', _options?: { locale?: string }): string {
	const stringValue = stringifySafeValue(value)
		.replace(/’/g, '')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
	const safeSeparator = separator || '-';
	const escapedSeparator = safeSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return stringValue
		.replace(/[^a-z0-9_]+/g, safeSeparator)
		.replace(new RegExp(`${escapedSeparator}+`, 'g'), safeSeparator)
		.replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
}

/**
 * Converts a list or field key into Keystone's legacy URL path form.
 *
 * @param value Value to convert.
 * @param makePlural Whether to pluralize the last path segment.
 * @returns Dash-separated path text.
 */
export function keyToPath(value: unknown, makePlural?: boolean): string {
	let stringValue = value;
	const toString = (value as { toString?: unknown } | null | undefined)?.toString;
	if (value && typeof toString === 'function') {
		stringValue = toString.call(value) as string;
	}
	if (typeof stringValue !== 'string' || stringValue.length === 0) {
		return '';
	}
	const parts = slug(keyToLabel(stringValue)).split('-');
	if (parts.length && makePlural) {
		const lastIndex = parts.length - 1;
		parts[lastIndex] = pluralize(parts[lastIndex] ?? '');
	}
	return parts.join('-');
}

/**
 * Converts a list or field key into Keystone's legacy headless camel-case form.
 *
 * @param value Value to convert.
 * @param makePlural Whether to pluralize the last property segment.
 * @returns Headless camel-case property text.
 */
export function keyToProperty(value: unknown, makePlural?: boolean): string {
	let stringValue = value;
	const toString = (value as { toString?: unknown } | null | undefined)?.toString;
	if (value && typeof toString === 'function') {
		stringValue = toString.call(value) as string;
	}
	if (typeof stringValue !== 'string' || stringValue.length === 0) {
		return '';
	}
	const parts = slug(keyToLabel(stringValue)).split('-');
	if (parts.length && makePlural) {
		const lastIndex = parts.length - 1;
		parts[lastIndex] = pluralize(parts[lastIndex] ?? '');
	}
	for (let i = 1; i < parts.length; i++) {
		parts[i] = upcase(parts[i] ?? '');
	}
	return parts.join('');
}
