import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import TextType from '../text/TextType.mjs';
import type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';
import { textToHTML } from '../../../lib/utils/html.mjs';

class TextareaType extends FieldType<KeystoneFieldOptionsForTextareaType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Textarea';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'textarea';

	/** Height of the textarea in pixels. */
	height: number;
	/** Always true for Textarea fields. */
	multiline: true;

	declare _nativeType: StringConstructor;
	declare _underscoreMethods: string[];
	declare _properties: string[];

	/** Validates input string length. Delegated from TextType. */
	declare validateInput: (data: Record<string, unknown>, callback: (result: boolean) => void) => void;
	/** Validates that a required value is present. Delegated from TextType. */
	declare validateRequiredInput: (item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void) => void;
	/** Converts a filter descriptor into a Mongoose query condition. Delegated from TextType. */
	declare addFilterToQuery: (filter: KSAdminUiFilterForTextField) => Record<string, unknown>;
	/** Truncates the stored value to `length` characters. Delegated from TextType. */
	declare crop: (item: MongooseDocument, length: number, append?: string, preserveWords?: boolean) => string;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForTextareaType) {
		super(list, path, options);
		this.height = options.height ?? 90;
		this.multiline = true;
	}

	override format (item: MongooseDocument): string {
		return textToHTML(item.get(this.path));
	}
}
TextareaType.prototype._nativeType = String;
TextareaType.prototype._underscoreMethods = ['format', 'crop'];
TextareaType.prototype._properties = ['height', 'multiline'];
// eslint-disable-next-line @typescript-eslint/unbound-method
TextareaType.prototype.validateInput = TextType.prototype.validateInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
TextareaType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
TextareaType.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
// eslint-disable-next-line @typescript-eslint/unbound-method
TextareaType.prototype.crop = TextType.prototype.crop;

export default TextareaType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Textarea field type (B1c)
// ---------------------------------------------------------------------------

// Re-export for consumers who import from this module directly.
export type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';

/**
 * Options bag for the Textarea field type constructor.
 */
export interface KeystoneFieldOptionsForTextareaType extends FieldOptionsBase {
	/**
	 * Height of the textarea in pixels.
	 * Default: 90.
	 */
	height?: number;
	/** Minimum character length; validated on save (inherited from TextType). */
	min?: number;
	/** Maximum character length; validated on save (inherited from TextType). */
	max?: number;
	/** Reserved for field registry use — binds this options bag to the Textarea type. */
	type?: unknown;
}

/**
 * Shape of a Textarea field instance (the object returned by `new textarea(...)`).
 * Validation and filter methods are inherited from TextType via prototype assignment.
 */
export interface KeystoneFieldForTextareaType {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Underscore methods added to documents (includes 'format', 'crop'). */
	_underscoreMethods: string[];
	/** Height of the textarea in pixels. */
	height: number;
	/** Always `true` for Textarea fields. */
	multiline: true;
	/** Properties exposed to the Admin UI (includes 'height', 'multiline'). */
	_properties: string[];
	/** Field-specific options. */
	options: KeystoneFieldOptionsForTextareaType;
	/** The dot-separated field path on the schema. */
	path: string;
	/**
	 * Validates input string length based on `min`/`max` options.
	 * Inherited from TextType.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Validates that a non-empty value is present.
	 * Inherited from TextType.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the required value is present.
	 */
	validateRequiredInput(item: Record<string, unknown>, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Inherited from TextType.
	 * @param filter Filter descriptor from the Admin UI query.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForTextField): Record<string, unknown>;
	/**
	 * Truncates the stored value to `length` characters.
	 * Inherited from TextType. Exposed as the `_.crop` underscore method.
	 * @param item The document containing the value.
	 * @param item.get Reads the value at a dot-separated field path.
	 * @param length Maximum character length.
	 * @param append String to append when truncated.
	 * @param preserveWords When true, avoids breaking mid-word.
	 * @returns The (possibly truncated) string.
	 */
	crop(item: { get(path: string): unknown }, length: number, append?: string, preserveWords?: boolean): string;
	/**
	 * Formats the field's value, converting newlines to `<br>` tags.
	 * Exposed as the `_.format` underscore method.
	 * @param item The document containing the value.
	 * @param item.get Reads the value at a dot-separated field path.
	 * @returns The formatted HTML string.
	 */
	format(item: { get(path: string): unknown }): string;
}

/**
 * Constructor type for the Textarea field type.
 */
export type KeystoneTypeConstructorForTextareaType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForTextareaType) => KeystoneFieldForTextareaType;
