import { KeystoneField } from "./field";
import { KeystoneGroupHeading } from "./core";

/**
 * Admin UI element representing a field.
 * @see /admin/client/App/elemental/Field.js
 */
export interface KSAdminUiElementField {
	type: "field";
	field: KeystoneField;
}

/**
 * Admin UI element representing a heading.
 * @see /admin/client/App/elemental/Heading.js
 */
export interface KSAdminUiElementHeading {
	type: "heading";
	heading: string;
	options: KeystoneGroupHeading | Record<string, any>;
}

/**
 * Admin UI element representing an indent.
 * @see /admin/client/App/elemental/Indent.js
 */
export interface KSAdminUiElementIndent {
	type: "indent";
}

/**
 * Admin UI element representing an outdent.
 * @see /admin/client/App/elemental/Outdent.js
 */
export interface KSAdminUiElementOutdent {
	type: "outdent";
}

/**
 * Union type for all Admin UI elements.
 * Used to represent the various UI components in the Admin interface.
 */
export type KSAdminUIElement =
	| KSAdminUiElementField
	| KSAdminUiElementHeading
	| KSAdminUiElementIndent
	| KSAdminUiElementOutdent;
