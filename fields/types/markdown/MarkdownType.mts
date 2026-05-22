import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';
import { marked, type MarkedOptions } from 'marked';
import sanitizeHtml from 'sanitize-html';
import TextType from '../text/TextType.mjs';
import { escapeRegExp } from '../../../lib/utils/regexp.mjs';

class MarkdownType extends FieldType<KeystoneFieldOptionsForMarkdownType, MarkdownValue> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Markdown';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'markdown';

	declare _defaultSize: 'full';
	declare _properties: string[];

	/** Toolbar configuration for the wysiwyg editor. */
	toolbarOptions: Record<string, unknown>;
	/** Options passed to the marked Markdown parser. */
	markedOptions: MarkedOptions;
	/** Options passed to sanitize-html. */
	sanitizeOptions: sanitizeHtml.IOptions;
	/** Editor height in pixels. */
	height: number;
	/** Whether to enable wysiwyg mode. */
	wysiwyg: boolean;
	/** Derived nested paths: `md` and `html`. Set in `addToSchema`. */
	paths!: { md: string; html: string };

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForMarkdownType) {
		super(list, path, options);
		this.toolbarOptions = options.toolbarOptions ?? {};
		this.markedOptions = (options.markedOptions ?? {}) as MarkedOptions;
		this.sanitizeOptions = (options.sanitizeOptions ?? {}) as sanitizeHtml.IOptions;
		this.height = options.height ?? 90;
		this.wysiwyg = ('wysiwyg' in options) ? (options.wysiwyg as boolean) : true;
	}

	override addToSchema(schema: import('mongoose').Schema): void {
		const paths = this.paths = {
			md: this.path + '.md',
			html: this.path + '.html',
		};
		const markedOptions = this.markedOptions;
		const sanitizeOptions = this.sanitizeOptions;

		const setMarkdown = function (this: MongooseDocument, value: unknown): string | undefined {
			if (typeof value !== 'string') {
				this.set(paths.md, undefined);
				this.set(paths.html, undefined);
				return undefined;
			}
			const newMd = sanitizeHtml(value, sanitizeOptions);
			const newHtml = marked(newMd, markedOptions) as unknown as string;
			if (newMd === this.get(paths.md) && newHtml === this.get(paths.html)) {
				return newMd;
			}
			this.set(paths.md, newMd);
			this.set(paths.html, newHtml);
			return newMd;
		};

		(schema as unknown as { nested: Record<string, boolean> }).nested[this.path] = true;
		schema.add({
			html: { type: String },
			md: { type: String, set: setMarkdown },
		}, this.path + '.');
		this.bindUnderscoreMethods();
	}

	addFilterToQuery(filter: KSAdminUiFilterForMarkdownField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		if (filter.mode === 'exactly' && !filter.value) {
			query[this.paths.md] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
			return query;
		}
		let value: string | RegExp = escapeRegExp(filter.value ?? '');
		if (filter.mode === 'beginsWith') {
			value = '^' + value;
		} else if (filter.mode === 'endsWith') {
			value = value + '$';
		} else if (filter.mode === 'exactly') {
			value = '^' + value + '$';
		}
		value = new RegExp(value, filter.caseSensitive ? '' : 'i');
		query[this.paths.md] = filter.inverted ? { $not: value } : value;
		return query;
	}

	override format(item: MongooseDocument): string {
		return item.get(this.paths.html) as string;
	}

	override getData(item: MongooseDocument): MarkdownValue {
		const value = item.get(this.path);
		return (typeof value === 'object' && value !== null ? value : {}) as MarkdownValue;
	}

	override inputIsValid(data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		if (!(this.path in data) && item?.get(this.paths.md)) {
			return true;
		}
		return (!required || data[this.path]) ? true : false;
	}

	override isModified(item: MongooseDocument): boolean {
		return item.isModified(this.paths.md);
	}

	override updateItem(item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const value = this.getValueFromData(data);
		if (value !== undefined) {
			item.set(this.paths.md, value);
		} else if (this.paths.md in data) {
			item.set(this.paths.md, data[this.paths.md]);
		}
		process.nextTick(callback);
	}

	/**
	 * Validates that the submitted markdown value is a string (or absent).
	 * Assigned from TextType.prototype.
	 */
	declare validateInput: (data: Record<string, unknown>, callback: (valid: boolean) => void) => void;

	/**
	 * Validates that a non-empty markdown value is present.
	 * Assigned from TextType.prototype.
	 */
	declare validateRequiredInput: (item: MongooseDocument, data: Record<string, unknown>, callback: (valid: boolean) => void) => void;
}
MarkdownType.prototype._defaultSize = 'full';
MarkdownType.prototype._properties = ['wysiwyg', 'height', 'toolbarOptions'];
// eslint-disable-next-line @typescript-eslint/unbound-method
MarkdownType.prototype.validateInput = TextType.prototype.validateInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
MarkdownType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

export default MarkdownType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Markdown field type (Phase 2)
// ---------------------------------------------------------------------------

/**
 * The value stored by the Markdown field: an object with `md` and `html` sub-paths.
 */
export interface MarkdownValue {
	md?: string;
	html?: string;
}

/**
 * Admin-UI filter descriptor accepted by `MarkdownType.prototype.addFilterToQuery`.
 * Matches the shape of `KSAdminUiFilterForTextField` but applied to the `.md` sub-path.
 */
export type KSAdminUiFilterForMarkdownField = KSAdminUiFilterForTextField;

/**
 * Options bag for the Markdown field type constructor.
 */
export interface KeystoneFieldOptionsForMarkdownType extends FieldOptionsBase {
	/** Enable the wysiwyg Markdown editor. Default: true. */
	wysiwyg?: boolean;
	/** Editor height in pixels. Default: 90. */
	height?: number;
	/** Toolbar options passed to the wysiwyg editor. */
	toolbarOptions?: Record<string, unknown>;
	/** Options forwarded to the marked Markdown parser. */
	markedOptions?: Record<string, unknown>;
	/** Options forwarded to sanitize-html. */
	sanitizeOptions?: Record<string, unknown>;
	/** Reserved for field registry use — binds this options bag to the Markdown type. */
	type?: unknown;
}

/**
 * Constructor type for the Markdown field type.
 */
export type KeystoneTypeConstructorForMarkdownType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForMarkdownType) => MarkdownType;
