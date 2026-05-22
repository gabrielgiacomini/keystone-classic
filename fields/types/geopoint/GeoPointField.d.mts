/**
 * @file Hand-authored TypeScript declaration for fields/types/geopoint/GeoPointField.mjs.
 *
 * The runtime implementation lives in GeoPointField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the GeoPointField component.
 *
 * GeoPointField renders two numeric inputs for latitude and longitude.
 * The value is a two-element array: `[longitude, latitude]` (GeoJSON order).
 * Props derived from this.props usage in handleLat(), handleLong(), renderField(),
 * and renderValue().
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the GeoPointField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is a two-element tuple `[longitude, latitude]` (GeoJSON order).
 *   Index 0 is longitude; index 1 is latitude (matches renderField usage).
 */
export interface GeoPointFieldProps {
	/** Human-readable label displayed next to the coordinate inputs. */
	label: string;
	/** Called whenever either coordinate input changes. */
	onChange: (change: { path: FieldPath; value: [string | number, string | number] }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current geopoint value as [longitude, latitude]. */
	value?: [string | number, string | number];
}

/** The GeoPointField component — a lat/lng coordinate pair input for the legacy admin UI. */
declare const GeoPointField: React.ComponentClass<GeoPointFieldProps>;
export default GeoPointField;
