/**
 * @file Hand-authored TypeScript declaration for fields/types/relationship/RelationshipField.mjs.
 *
 * The runtime implementation lives in RelationshipField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the RelationshipField component.
 *
 * Recipe C/D: stateful field with XHR loading at the data boundary.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 8
 */

import type React from 'react';
import type { FieldPath, ListKey, ListPath } from '../branded.mjs';

/**
 * A related item as returned by the XHR API boundary.
 * The `href` field is added by the client after receiving the XHR response.
 */
export interface RelationshipItem {
	/** MongoDB document id. */
	id: string;
	/** Display name of the related item. */
	name: string;
	/** Admin link to the related item — injected client-side after XHR. */
	href?: string;
}

/**
 * Type guard for a single related item from the XHR response.
 * Narrows `unknown` to `RelationshipItem` at the XHR data boundary.
 * @param x - The value to check.
 * @returns Whether the value is a RelationshipItem.
 */
export function isRelationshipItem(x: unknown): x is RelationshipItem {
	return (
		typeof x === 'object' &&
		x !== null &&
		typeof (x as { id: unknown }).id === 'string' &&
		typeof (x as { name: unknown }).name === 'string'
	);
}

/**
 * The ref-list descriptor passed as `refList` prop — a minimal projection
 * of KeystoneJS list metadata needed by this component.
 */
export interface RelationshipRefList {
	/** The stable key of the related list (e.g. 'User'). Branded as ListKey. */
	key: ListKey;
	/** The URL path slug of the related list (e.g. 'users'). Branded as ListPath. */
	path: ListPath;
}

/**
 * Props for the RelationshipField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `refList` is typed as `RelationshipRefList` for safe list key/path usage.
 * - `many` controls whether this is a to-many (multi-select) relationship.
 */
export interface RelationshipFieldProps {
	/** Whether the field should be collapsed when empty. */
	collapse?: boolean;
	/** Whether to allow creating new related items inline. */
	createInline?: boolean;
	/** Filters to apply to the related list query. Keys are field names, values are filter values. */
	filters?: Record<string, string>;
	/** Human-readable label for the field. */
	label?: string;
	/** Whether this is a to-many relationship (multi-select). */
	many?: boolean;
	/** The field's mode — 'edit' or 'view'. */
	mode?: 'edit' | 'view';
	/**
	 * Called when the selected value(s) change.
	 * For many=true, value is a comma-separated string of IDs.
	 */
	onChange: (change: { path: FieldPath; value: string | string[] | null }) => void;
	/** Called when related item values have been loaded from XHR. */
	onValuesLoaded?: (path: FieldPath) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Descriptor of the related list. */
	refList: RelationshipRefList;
	/**
	 * Current value(s) of the field.
	 * For many=true: an array of document id strings.
	 * For many=false: a single document id string or null/undefined.
	 */
	value?: string | string[] | null;
	/** All current form values — used for filter interpolation. */
	values?: Record<string, unknown>;
}

/**
 * Internal state of the RelationshipField component.
 *
 * Documented here for reference — TypeScript consumers care about props,
 * not internal state. The XHR loading flag and resolved item(s) live here.
 */
export interface RelationshipFieldState {
	/** Whether the create modal is open. */
	createIsOpen: boolean;
	/** Whether a value is currently being loaded via XHR. */
	loading?: boolean;
	/**
	 * The resolved related item(s) after XHR loading.
	 * For many=true: an array of RelationshipItems.
	 * For many=false: a single RelationshipItem or null.
	 */
	value: RelationshipItem | RelationshipItem[] | null;
}

/** The RelationshipField component — a select-based relationship field for the legacy admin UI. */
declare const RelationshipField: React.ComponentClass<RelationshipFieldProps>;
export default RelationshipField;
