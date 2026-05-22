import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase } from '../Type.mjs';
import type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';
import TextType from '../text/TextType.mjs';

class HtmlType extends FieldType<KeystoneFieldOptionsForHtmlType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Html';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'html';

	declare _nativeType: StringConstructor;
	declare _defaultSize: 'full';
	declare _properties: string[];

	/** Whether the WYSIWYG editor is enabled. */
	wysiwyg: boolean;
	/** Height of the editor in pixels. */
	height: number;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForHtmlType) {
		super(list, path, options);
		this.wysiwyg = options.wysiwyg ?? false;
		this.height = options.height ?? 180;
	}

	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Assigned from TextType.prototype at the bottom of this file.
	 */
	declare addFilterToQuery: (filter: KSAdminUiFilterForTextField) => Record<string, unknown>;
}
HtmlType.prototype._nativeType = String;
HtmlType.prototype._defaultSize = 'full';
HtmlType.prototype._properties = ['wysiwyg', 'height'];
// eslint-disable-next-line @typescript-eslint/unbound-method
HtmlType.prototype.validateInput = TextType.prototype.validateInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
HtmlType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
HtmlType.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

export default HtmlType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Html field type (B1e)
// ---------------------------------------------------------------------------

// Re-export for consumers who import from this module directly.
export type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';

/**
 * Options bag for the Html field type constructor.
 */
export interface KeystoneFieldOptionsForHtmlType extends FieldOptionsBase {
	/**
	 * Whether to enable a WYSIWYG editor in the Admin UI.
	 * Default: false.
	 */
	wysiwyg?: boolean;
	/**
	 * Height of the editor in pixels.
	 * Default: 180.
	 */
	height?: number;
	/** Reserved for field registry use — binds this options bag to the Html type. */
	type?: unknown;
}

/**
 * Shape of an Html field instance (the object returned by `new html(...)`).
 * Validation and filter methods are inherited from TextType via prototype assignment.
 */
export interface KeystoneFieldForHtmlType {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Default Admin UI column size ('full'). */
	_defaultSize: string;
	/** Whether the WYSIWYG editor is enabled. */
	wysiwyg: boolean;
	/** Height of the editor in pixels. */
	height: number;
	/** Properties exposed to the Admin UI (includes 'wysiwyg', 'height'). */
	_properties: string[];
	/** Field-specific options. */
	options: KeystoneFieldOptionsForHtmlType;
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
 * Constructor type for the Html field type.
 */
export type KeystoneTypeConstructorForHtmlType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForHtmlType) => KeystoneFieldForHtmlType;
