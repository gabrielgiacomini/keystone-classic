import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase } from '../Type.mjs';
import type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';
import TextType from '../text/TextType.mjs';

class CodeType extends FieldType<KeystoneFieldOptionsForCodeType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Code';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'code';

	declare _nativeType: StringConstructor;
	declare _defaultSize: 'full';
	declare _properties: string[];

	/** Height of the code editor in pixels. */
	height: number;
	/** Language mode for the code editor (e.g. 'javascript'). */
	lang: string | undefined;
	/** Raw CodeMirror options passed via `options.codemirror`. */
	codemirror: Record<string, unknown>;
	/** Combined editor options (includes `mode: lang`). */
	editor: Record<string, unknown>;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForCodeType) {
		super(list, path, options);
		this.height = options.height ?? 180;
		this.lang = options.lang ?? options.language;
		this.codemirror = options.codemirror ?? {};
		this.editor = Object.assign({ mode: this.lang }, this.codemirror);
	}

	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Assigned from TextType.prototype at the bottom of this file.
	 */
	declare addFilterToQuery: (filter: KSAdminUiFilterForTextField) => Record<string, unknown>;
}
CodeType.prototype._nativeType = String;
CodeType.prototype._defaultSize = 'full';
CodeType.prototype._properties = ['editor', 'height', 'lang'];
// eslint-disable-next-line @typescript-eslint/unbound-method
CodeType.prototype.validateInput = TextType.prototype.validateInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
CodeType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
CodeType.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

export default CodeType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Code field type (B1h)
// ---------------------------------------------------------------------------

// Re-export for consumers who import from this module directly.
export type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';

/**
 * Options bag for the Code field type constructor.
 */
export interface KeystoneFieldOptionsForCodeType extends FieldOptionsBase {
	/**
	 * Height of the code editor in pixels.
	 * Default: 180.
	 */
	height?: number;
	/**
	 * Language mode for the code editor (e.g. 'javascript', 'css').
	 * Alias: `language`.
	 */
	lang?: string;
	/**
	 * Alias for `lang`. Preferred over `lang` when both are present.
	 */
	language?: string;
	/**
	 * Additional CodeMirror options passed directly to the editor.
	 * Default: `{}`.
	 */
	codemirror?: Record<string, unknown>;
	/** Reserved for field registry use — binds this options bag to the Code type. */
	type?: unknown;
}

/**
 * Shape of a Code field instance (the object returned by `new code(...)`).
 * Validation and filter methods are inherited from TextType via prototype assignment.
 */
export interface KeystoneFieldForCodeType {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Default Admin UI column size ('full'). */
	_defaultSize: string;
	/** Height of the editor in pixels. */
	height: number;
	/** Language mode for the code editor. */
	lang: string | undefined;
	/** Properties exposed to the Admin UI (includes 'editor', 'height', 'lang'). */
	_properties: string[];
	/** Combined CodeMirror editor options object (includes `mode: lang`). */
	editor: Record<string, unknown>;
	/** Raw CodeMirror options passed in via `options.codemirror`. */
	codemirror: Record<string, unknown>;
	/** Field-specific options. */
	options: KeystoneFieldOptionsForCodeType;
	/** The dot-separated field path on the schema. */
	path: string;
	/**
	 * Validates the submitted string value.
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
}

/**
 * Constructor type for the Code field type.
 */
export type KeystoneTypeConstructorForCodeType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForCodeType) => KeystoneFieldForCodeType;
