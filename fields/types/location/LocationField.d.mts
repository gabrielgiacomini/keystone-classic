/**
 * @file Hand-authored TypeScript declaration for fields/types/location/LocationField.mjs.
 *
 * The runtime implementation lives in LocationField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the LocationField component.
 *
 * Recipe C/D: stateful field with Google Maps API integration.
 * State tracks which optional sub-fields are collapsed and which Maps API
 * improve/overwrite checkboxes are checked.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 8
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * The structured location value stored in the document.
 * All parts are optional — a partial address is valid.
 */
export interface LocationValue {
	/** PO Box / Shop number or similar. */
	number?: string;
	/** Building name. */
	name?: string;
	/** Street address line 1. */
	street1?: string;
	/** Street address line 2. */
	street2?: string;
	/** Suburb / city. */
	suburb?: string;
	/** State / province. */
	state?: string;
	/** Postal / zip code. */
	postcode?: string;
	/** Country. */
	country?: string;
	/**
	 * Geographic coordinates [longitude, latitude] as a tuple.
	 * Index 0 = longitude, Index 1 = latitude (MongoDB GeoJSON convention).
	 */
	geo?: [string | number, string | number];
}

/**
 * The sub-path descriptors for the location field's composite inputs.
 * Each sub-path corresponds to one or more hidden form inputs.
 */
export interface LocationFieldPaths {
	/** Form input name for the geo coordinates hidden inputs. */
	geo: FieldPath;
	/** Form input name for the Google Maps 'improve' checkbox. */
	improve: FieldPath;
	/** Form input name for the Google Maps 'overwrite' checkbox. */
	overwrite: FieldPath;
}

/**
 * Props for the LocationField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is the structured location object (all fields optional).
 * - `enableMapsAPI` activates the Google Maps improve/overwrite checkboxes.
 */
export interface LocationFieldProps {
	/** Whether the field should be collapsed when the location is empty. */
	collapse?: boolean;
	/** Whether to show the Google Maps API improve/overwrite options. */
	enableMapsAPI?: boolean;
	/** Human-readable label for the field. */
	label?: string;
	/** The field's mode — 'edit' or 'view'. */
	mode?: 'edit' | 'view';
	/** Optional help note displayed beneath the field. */
	note?: string;
	/**
	 * Called whenever any part of the location changes.
	 * `value` is the full merged location object with the changed sub-field updated.
	 */
	onChange: (change: { path: FieldPath; value: LocationValue }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Sub-paths for the geo, improve, and overwrite hidden inputs. */
	paths: LocationFieldPaths;
	/** Current structured location value. */
	value?: LocationValue;
}

/**
 * Internal state of the LocationField component.
 *
 * Documented for reference — TypeScript consumers care about props, not
 * internal state. The collapsed optional sub-fields and Maps API checkbox
 * states live here.
 */
export interface LocationFieldState {
	/**
	 * Map of sub-field names → `true` when that sub-field is currently collapsed.
	 * Collapsed sub-fields are hidden from view until the user expands them.
	 * Sub-fields that may be collapsed: 'number', 'name', 'street2', 'geo'.
	 */
	collapsedFields: Record<string, boolean>;
	/**
	 * Whether the "Autodetect and improve location on save" Maps API checkbox
	 * is checked.
	 */
	improve: boolean;
	/**
	 * Whether the "Replace existing data" Maps API checkbox is checked.
	 * Only relevant when `improve` is true.
	 */
	overwrite: boolean;
}

/** The LocationField component — a structured address/location field for the legacy admin UI. */
declare const LocationField: React.ComponentClass<LocationFieldProps>;
export default LocationField;
