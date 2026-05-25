import bindMethods from './bindMethods.mjs';
import { defer } from './async.mjs';
import { isEmail } from './email.mjs';
import { decodeHTMLEntities, encodeHTMLEntities, htmlToText, textToHTML } from './html.mjs';
import isObject from './isObject.mjs';
import { number } from './number.mjs';
import { isValidObjectId } from './objectId.mjs';
import { optionsMap } from './optionsMap.mjs';
import { escapeRegExp } from './regexp.mjs';
import { camelize } from './inflect.mjs';
import {
	cropString,
	downcase,
	keyToLabel,
	keyToPath,
	keyToProperty,
	plural,
	singular,
	slug,
} from './string.mjs';

const DEFAULT_RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
const RADIUS_KM = 6371;
const RADIUS_MILES = 3959;

const CYRILLIC_TO_LATIN: Record<string, string> = {
	'\u0410': 'A', '\u0430': 'a', '\u0411': 'B', '\u0431': 'b',
	'\u0412': 'V', '\u0432': 'v', '\u0413': 'G', '\u0433': 'g',
	'\u0414': 'D', '\u0434': 'd', '\u0415': 'E', '\u0435': 'e',
	'\u0401': 'E', '\u0451': 'e', '\u0416': 'Zh', '\u0436': 'zh',
	'\u0417': 'Z', '\u0437': 'z', '\u0418': 'Y', '\u0438': 'y',
	'\u0419': 'Y', '\u0439': 'i', '\u041A': 'K', '\u043A': 'k',
	'\u041B': 'L', '\u043B': 'l', '\u041C': 'M', '\u043C': 'm',
	'\u041D': 'N', '\u043D': 'n', '\u041E': 'O', '\u043E': 'o',
	'\u041F': 'P', '\u043F': 'p', '\u0420': 'R', '\u0440': 'r',
	'\u0421': 'S', '\u0441': 's', '\u0422': 'T', '\u0442': 't',
	'\u0423': 'U', '\u0443': 'u', '\u0424': 'F', '\u0444': 'f',
	'\u0425': 'Kh', '\u0445': 'kh', '\u0426': 'Ts', '\u0446': 'ts',
	'\u0427': 'Ch', '\u0447': 'ch', '\u0428': 'Sh', '\u0448': 'sh',
	'\u0429': 'Shch', '\u0449': 'shch', '\u042A': '', '\u044A': '',
	'\u042B': 'Y', '\u044B': 'y', '\u042C': '', '\u044C': '',
	'\u042D': 'E', '\u044D': 'e', '\u042E': 'Yu', '\u044E': 'iu',
	'\u042F': 'Ya', '\u044F': 'ia', '\u0404': 'Ye', '\u0454': 'ie',
	'\u0406': 'I', '\u0456': 'i', '\u0407': 'Yi', '\u0457': 'i',
	'\u0490': 'G', '\u0491': 'g', "'": '',
};

/**
 * Function shape and static character sets exposed by `randomString`.
 */
export interface RandomStringFunction {
	(length?: number | [number, number] | string, chars?: string): string;
	alphanumeric: string;
	default: string;
	lower: string;
	numbers: string;
	safe: string;
	upper: string;
}

/**
 * Legacy utility object exposed as `keystone.utils`.
 */
export interface KeystoneUtils {
	bindMethods: typeof bindMethods;
	calculateDistance(point1: [number, number], point2: [number, number]): number;
	camelcase(value: string, lowercaseFirstWord?: boolean): string;
	cropHTMLString(value: unknown, length: number, append?: string | boolean | null, preserveWords?: boolean): string;
	cropString: typeof cropString;
	decodeHTMLEntities: typeof decodeHTMLEntities;
	defer: typeof defer;
	downcase: typeof downcase;
	encodeHTMLEntities: typeof encodeHTMLEntities;
	escapeRegExp: typeof escapeRegExp;
	escapeString(value: unknown): string;
	htmlStringify(value: unknown, fromRecur?: number): string;
	htmlToText: typeof htmlToText;
	isArray(value: unknown): value is unknown[];
	isDataURL(value: unknown): boolean;
	isDate(value: unknown): value is Date;
	isEmail: typeof isEmail;
	isFunction(value: unknown): value is (...args: unknown[]) => unknown;
	isNumber(value: unknown): value is number;
	isObject: typeof isObject;
	isString(value: unknown): value is string;
	isValidObjectId: typeof isValidObjectId;
	keyToLabel: typeof keyToLabel;
	keyToPath: typeof keyToPath;
	keyToProperty: typeof keyToProperty;
	kmBetween(point1: [number, number], point2: [number, number]): number;
	milesBetween(point1: [number, number], point2: [number, number]): number;
	noop(): void;
	number: typeof number;
	options<T extends Record<string, unknown>>(defaults?: T, ops?: Partial<T> & Record<string, unknown>): T;
	optionsMap: typeof optionsMap;
	plural: typeof plural;
	randomString: RandomStringFunction;
	singular: typeof singular;
	slug: typeof slug;
	stringify(value: unknown): string;
	stripDiacritics(value: unknown): string;
	textToHTML: typeof textToHTML;
	titlecase(value: unknown): string;
	transliterate(value: unknown): string;
	upcase(value: unknown): string;
}

function toStringLike(value: unknown): string {
	if (value && typeof (value as { toString?: unknown }).toString === 'function') {
		return (value as { toString(): string }).toString();
	}
	return typeof value === 'string' ? value : '';
}

function compact(values: string[]): string[] {
	return values.filter(Boolean);
}

function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === 'function';
}

function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

function isDate(value: unknown): value is Date {
	return Object.prototype.toString.call(value) === '[object Date]';
}

function isString(value: unknown): value is string {
	return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

function isDataURL(value: unknown): boolean {
	if (typeof value !== 'string') return false;
	// eslint-disable-next-line sonarjs/regex-complexity, sonarjs/duplicates-in-character-class -- Preserves the legacy keystone-utils data URL detector.
	const pattern = /^\s*data:([a-z]+\/[a-z0-9\-+]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i;
	return pattern.test(value);
}

function options<T extends Record<string, unknown>>(defaults?: T, ops?: Partial<T> & Record<string, unknown>): T {
	const target = (defaults ?? {}) as T;
	const source: Record<string, unknown> = ops ?? {};
	for (const key of Object.keys(source)) {
		target[key as keyof T] = source[key] as T[keyof T];
	}
	return target;
}

function noop(): void {}

function randomStringImpl(length?: number | [number, number] | string, chars = DEFAULT_RANDOM_CHARS): string {
	let resolvedLength: number;
	if (Array.isArray(length)) {
		const min = Number.parseInt(String(length[0] || 10), 10);
		const max = Number.parseInt(String(length[1] || 10), 10);
		resolvedLength = Math.round(Math.random() * (max - min)) + min;
	} else if (length === undefined || length === '') {
		resolvedLength = 10;
	} else {
		resolvedLength = typeof length === 'number' ? length : Number.parseInt(length, 10);
	}
	let result = '';
	for (let i = 0; i < resolvedLength; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

const randomString = Object.assign(randomStringImpl, {
	alphanumeric: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ',
	default: DEFAULT_RANDOM_CHARS,
	lower: 'abcdefghijklmnopqrstuvwxtz',
	numbers: '0123456789',
	safe: '2346789ABCDEFGHJKLMNPRTUVWXTZ',
	upper: 'ABCDEFGHIJKLMNOPQRSTUVWXTZ',
}) as RandomStringFunction;

function escapeString(value: unknown): string {
	const text = toStringLike(value);
	if (!text.length) return '';
	return text.replace(/[\\'"]/g, '\\$&');
}

function stripDiacritics(value: unknown): string {
	const text = toStringLike(value);
	if (!text.length) return '';
	return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

function transliterate(value: unknown): string {
	let text = toStringLike(value);
	if (!text.length) return '';
	text = text.replace(/\u0437\u0433/g, 'zgh').replace(/\u0417\u0433/g, 'Zgh').replace(/\u0417\u0413/g, 'ZGH');
	let result = '';
	for (const char of text) {
		result += Object.prototype.hasOwnProperty.call(CYRILLIC_TO_LATIN, char) ? CYRILLIC_TO_LATIN[char] : char;
	}
	return result;
}

function upcase(value: unknown): string {
	const text = toStringLike(value);
	if (!text.length) return '';
	return text.substring(0, 1).toUpperCase() + text.substring(1);
}

function titlecase(value: unknown): string {
	let text = toStringLike(value);
	if (!text.length) return '';
	text = text.replace(/([a-z])([A-Z])/g, '$1 $2');
	const parts = text.split(/\s|_|-/);
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i] ?? '';
		if (part && !/^[A-Z0-9]+$/.test(part)) {
			parts[i] = upcase(part);
		}
	}
	return compact(parts).join(' ');
}

function camelcase(value: string, lowercaseFirstWord?: boolean): string {
	return camelize(value, !lowercaseFirstWord);
}

function stringify(value: unknown): string {
	// eslint-disable-next-line no-control-regex, sonarjs/no-control-regex -- Matches legacy JSON escaping for line separator characters.
	return JSON.stringify(value).replace(/[\u000A\u000D\u2028\u2029]/g, function escapeIllegalJsonChar(char) {
		return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
	});
}

function cropHTMLString(value: unknown, length: number, append?: string | boolean | null, preserveWords?: boolean): string {
	return textToHTML(cropString(htmlToText(value), length, append, preserveWords));
}

function htmlStringify(value: unknown, fromRecur?: number): string {
	const tag = fromRecur ? 'span' : 'div';
	const nextLevel = (fromRecur || 0) + 1;
	if (typeof value === 'string') {
		return `<${tag} style="color: #0e4889; cursor: default;">"${value}"</${tag}>`;
	}
	if (typeof value === 'boolean' || value === null || value === undefined) {
		return `<${tag}><em style="color: #06624b; cursor: default;">${String(value)}</em></${tag}>`;
	}
	if (typeof value === 'number') {
		return `<${tag} style="color: #ca000a; cursor: default;">${value}</${tag}>`;
	}
	if (isDate(value)) {
		return `<${tag} style="color: #009f7b; cursor: default;">${value.toString()}</${tag}>`;
	}
	if (Array.isArray(value)) {
		let result = `<${tag} style="color: #666; cursor: default;">Array: [`;
		if (!value.length) return result + `]</${tag}>`;
		result += `</${tag}><div style="padding-left: 20px;">`;
		for (let i = 0; i < value.length; i++) {
			result += `<span></span>${htmlStringify(value[i], nextLevel)}`;
			if (i < value.length - 1) result += ', <br>';
		}
		return result + `</div><${tag} style="color: #666">]</${tag}>`;
	}
	if (typeof value === 'object') {
		const keys = Object.keys(value);
		if (fromRecur && !keys.length) {
			return `<${tag} style="color: #999; cursor: default;">Object: {}</${tag}>`;
		}
		let result = '';
		if (fromRecur) {
			result += `<${tag} style="color: #0b89b6">Object: {</${tag}><div class="_stringify_recur _stringify_recur_level_${fromRecur}" style="padding-left: 20px;">`;
		}
		for (const key in value as Record<string, unknown>) {
			const child = (value as Record<string, unknown>)[key];
			if (typeof child !== 'function') {
				result += `<div><span style="padding-right: 5px; cursor: default;">${key}:</span>${htmlStringify(child, nextLevel)}</div>`;
			}
		}
		if (fromRecur) {
			result += `</div><${tag} style="color: #0b89b6; cursor: default;">}</${tag}>`;
		}
		return result;
	}
	return '';
}

function calculateDistance(point1: [number, number], point2: [number, number]): number {
	const deltaLng = (point2[0] - point1[0]) * Math.PI / 180;
	const deltaLat = (point2[1] - point1[1]) * Math.PI / 180;
	const lat1 = point1[1] * Math.PI / 180;
	const lat2 = point2[1] * Math.PI / 180;
	const haversine = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
		+ Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(lat1) * Math.cos(lat2);
	return 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function kmBetween(point1: [number, number], point2: [number, number]): number {
	return calculateDistance(point1, point2) * RADIUS_KM;
}

function milesBetween(point1: [number, number], point2: [number, number]): number {
	return calculateDistance(point1, point2) * RADIUS_MILES;
}

const keystoneUtils: KeystoneUtils = {
	bindMethods,
	calculateDistance,
	camelcase,
	cropHTMLString,
	cropString,
	decodeHTMLEntities,
	defer,
	downcase,
	encodeHTMLEntities,
	escapeRegExp,
	escapeString,
	htmlStringify,
	htmlToText,
	isArray,
	isDataURL,
	isDate,
	isEmail,
	isFunction,
	isNumber,
	isObject,
	isString,
	isValidObjectId,
	keyToLabel,
	keyToPath,
	keyToProperty,
	kmBetween,
	milesBetween,
	noop,
	number,
	options,
	optionsMap,
	plural,
	randomString,
	singular,
	slug,
	stringify,
	stripDiacritics,
	textToHTML,
	titlecase,
	transliterate,
	upcase,
};

export default keystoneUtils;
