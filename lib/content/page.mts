import keystone from '../../index.mjs';
import Path from '../path.mjs';
import { ContentType } from './type.mjs';

function getUtils (): { keyToLabel(key: string): string; isObject(val: unknown): boolean } {
	return (keystone as unknown as { utils: { keyToLabel(key: string): string; isObject(val: unknown): boolean } }).utils;
}

const UNSAFE_PATH_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype']);

interface ContentField {
	path: string;
	options: Record<string, unknown>;
	populate(value: unknown): unknown;
	validateInput(value: unknown): boolean;
	validateRequiredInput(value: unknown): boolean;
	clean(value: unknown): unknown;
}

/** Constructor for a ContentType subclass (or ContentType itself). */
type ContentTypeConstructor = new (path: string, options: Record<string, unknown>) => ContentType;

function asRecord (value: unknown): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
	return value as Record<string, unknown>;
}

function assertSafePath (path: string): void {
	const unsafe = path.split('.').find(part => UNSAFE_PATH_SEGMENTS.has(part));
	if (unsafe) {
		throw new Error('keystone.content.Page.add() Error: unsafe field path segment "' + unsafe + '" is not allowed.');
	}
}

function readPath (path: string, data: Record<string, unknown>): unknown {
	return new (Path as unknown as new (path: string) => { get(data: Record<string, unknown>): unknown })(path).get(data);
}

function writePath (path: string, data: Record<string, unknown>, value: unknown): void {
	new (Path as unknown as new (path: string) => { addTo(data: Record<string, unknown>, value: unknown): void })(path).addTo(data, value);
}

/** Options bag passed to `new Page(key, options)`. */
interface PageOptions {
	name?: string;
	[key: string]: unknown;
}

/**
 * Page.
 */
export class Page {
	key: string;
	options: PageOptions;
	fields: Record<string, ContentField>;

	/**
	 * Documentation placeholder.
	 * @param key - Description
	 * @param options - Description
	 */
	constructor (key: string, options: PageOptions = {}) {
		this.options = Object.assign({}, options);
		this.key = key;
		this.fields = {};
	}

	/**
	 * Documentation placeholder.
	 * @returns The return value.
	 */
	get name (): string {
		return (this.get('name') as string | null) || (this.set('name', getUtils().keyToLabel(this.key)) as string);
	}

	/**
	 * Documentation placeholder.
	 * @param key - Description
	 * @param value - Description
	 * @returns The return value.
	 */
	set (key: string, value: unknown): unknown {
		if (!key) throw new Error('keystone.content.Page.set() Error: must be provided with a key to set a value.');
		value = value || null;
		this.options[key] = value;
		return value;
	}

	/**
	 * Documentation placeholder.
	 * @param key - Description
	 * @returns The return value.
	 */
	get (key: string): unknown {
		if (!key) throw new Error('keystone.content.Page.get() Error: must be provided with a key to get a value.');
		if (!Object.prototype.hasOwnProperty.call(this.options, key)) return null;
		return this.options[key];
	}

	/**
	 * Documentation placeholder.
	 * @param fields - Description
	 * @returns The return value.
	 */
	add (fields: Record<string, unknown>): this {
		if (!getUtils().isObject(fields)) {
			throw new Error('keystone.content.Page.add() Error: fields must be an object.');
		}
		const self = this;
		Object.entries(fields).forEach(function ([path, options]) {
			assertSafePath(path);
			let fieldOptions = options as Record<string, unknown>;
			if (typeof fieldOptions === 'function') fieldOptions = { type: fieldOptions };
			if (typeof fieldOptions.type !== 'function') {
				throw new Error('keystone.content.page.add() Error: Page fields must be specified with a type function');
			}
			const typeConstructor = fieldOptions.type as ContentTypeConstructor;
			const isContentType = typeConstructor === (ContentType as unknown as ContentTypeConstructor)
				|| ContentType.prototype.isPrototypeOf(typeConstructor.prototype as object);
			if (!isContentType) {
				if (fieldOptions.type === String) {
					const contentTypes = (keystone as unknown as { content: { Types: { Text: ContentTypeConstructor } } }).content.Types;
					fieldOptions = Object.assign({}, fieldOptions, { type: contentTypes.Text });
				} else {
					throw new Error('keystone.content.page.add() Error: Unrecognised field constructor: ' + String(fieldOptions.type));
				}
			}
			const TypeCtor = fieldOptions.type as ContentTypeConstructor;
			self.fields[path] = new TypeCtor(path, fieldOptions);
		});
		return this;
	}

	/**
	 * Documentation placeholder.
	 * @returns The return value.
	 */
	register (): this {
		(keystone as unknown as { content: { page(key: string, page: Page): void } }).content.page(this.key, this);
		return this;
	}

	/**
	 * Documentation placeholder.
	 * @param data - Description
	 * @returns The return value.
	 */
	populate (data: unknown): Record<string, unknown> {
		const source = asRecord(data);
		const populated: Record<string, unknown> = {};
		Object.values(this.fields).forEach(function (field: ContentField) {
			const value = readPath(field.path, source);
			const output = field.populate(value);
			if (output !== undefined) {
				writePath(field.path, populated, output);
			}
		});
		return populated;
	}

	/**
	 * Documentation placeholder.
	 * @param data - Description
	 * @returns The return value.
	 */
	validate (data: unknown): Record<string, unknown> {
		const source = asRecord(data);
		const validated: Record<string, unknown> = {};
		Object.values(this.fields).forEach(function (field: ContentField) {
			const value = readPath(field.path, source);
			const isRequired = field.options.required === true;
			if (isRequired && !field.validateRequiredInput(value)) {
				throw new Error('keystone.content.Page.validate() Error: required field "' + field.path + '" is missing.');
			}
			if (value !== undefined && !field.validateInput(value)) {
				throw new Error('keystone.content.Page.validate() Error: invalid value for field "' + field.path + '".');
			}
			if (value !== undefined) {
				writePath(field.path, validated, value);
			}
		});
		return validated;
	}

	/**
	 * Documentation placeholder.
	 * @param data - Description
	 * @returns The return value.
	 */
	clean (data: unknown): Record<string, unknown> {
		const source = asRecord(data);
		const cleaned: Record<string, unknown> = {};
		Object.values(this.fields).forEach(function (field: ContentField) {
			const value = readPath(field.path, source);
			if (value !== undefined) {
				const output = field.clean(value);
				if (output !== undefined) {
					writePath(field.path, cleaned, output);
				}
			}
		});
		return cleaned;
	}
}

export default Page;
