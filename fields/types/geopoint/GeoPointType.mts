import { FieldType } from '../Type.mjs';
import type { MongooseDocument, KeystoneList, FieldOptionsBase } from '../Type.mjs';
import type { Schema } from 'mongoose';
import { defer } from '../../../lib/utils/async.mjs';

const REGEXP_LNGLAT = /^\s*(\-?\d+(?:\.\d+)?)\s*\,\s*(\-?\d+(?:\.\d+)?)\s*$/;

/** Filter shape passed to `addFilterToQuery` for GeoPoint fields. */
/** A single GeoPoint coordinate value (string, number, or null). */
type GeoPointCoordinate = string | number | null;

/** Filter shape passed to `addFilterToQuery` for GeoPoint fields. */
export interface KSAdminUiFilterForGeoPointField {
	lon?: GeoPointCoordinate;
	lat?: GeoPointCoordinate;
	distance?: {
		value?: GeoPointCoordinate;
		mode?: 'min' | 'max';
	};
}

/** GeoPoint field type for Keystone — stores [longitude, latitude] arrays. */
class GeoPointType extends FieldType<KeystoneFieldOptionsForGeoPointType, number[]> {
	static readonly properName = 'GeoPoint';
	static readonly typeName = 'geopoint';
	declare _fixedSize: 'medium';

	/**
	 * Adds the GeoPoint field to the Mongoose schema with a 2dsphere index.
	 * @param schema - The Mongoose schema to augment.
	 */
	override addToSchema (schema: Schema): void {
		schema.path(this.path, { ...this.options, type: [Number], index: '2dsphere' });
		this.bindUnderscoreMethods();
	}

	/**
	 * Extracts the GeoPoint coordinates from a document.
	 * @param item - The Mongoose document.
	 * @returns The [lon, lat] array or an empty array.
	 */
	override getData (item: MongooseDocument): number[] {
		const points = item.get(this.path) as number[] | undefined;
		return (points?.length === 2) ? points : [];
	}

	/**
	 * Formats the GeoPoint value as a human-readable string.
	 * @param item - The Mongoose document.
	 * @returns The formatted coordinates or null.
	 */
	override format (item: MongooseDocument): string | null {
		const pts = item.get(this.path) as number[] | undefined;
		if (pts) {
			return [...pts].reverse().join(', ');
		}
		return null;
	}

	/**
	 * Validates submitted input data for this field.
	 * @param data - The submitted form data.
	 * @param callback - Validation result callback.
	 */
	override validateInput (data: Record<string, unknown>, callback: (result: boolean) => void): void {
		let value = this.getValueFromData(data);
		let result = false;
		if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 2 && (value as unknown[]).join('') === '')) {
			result = true;
		} else {
			if (Array.isArray(value)) {
				value = value.length === 2 ? (value as unknown[]).join(',') : '';
			}
			if (typeof value === 'string') {
				result = REGEXP_LNGLAT.test(value);
			}
		}
		defer(callback, result);
	}

	/**
	 * Validates that required input is present for this field.
	 * @param item - The Mongoose document.
	 * @param data - The submitted form data.
	 * @param callback - Validation result callback.
	 */
	override validateRequiredInput (item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		const result = (value || (value === undefined && (item.get(this.path) as number[] | undefined)?.length === 2)) ? true : false;
		defer(callback, result);
	}

	/**
	 * Checks whether the submitted data is a valid GeoPoint value.
	 * @param data - The submitted form data.
	 * @param required - Whether the field is required.
	 * @param _item - Unused; the Mongoose document.
	 * @returns Whether the input is valid.
	 */
	override inputIsValid (data: Record<string, unknown>, required?: boolean, _item?: MongooseDocument): boolean {
		let values = this.getValueFromData(data);
		if (values === undefined && !required) return true;
		if (Array.isArray(values)) {
			values = values.length === 2 ? (values as unknown[]).join(',') : '';
		}
		if (typeof values !== 'string') return false;
		if ((values === '' || values.startsWith(',') || values.endsWith(',')) && !required) return true;
		return REGEXP_LNGLAT.test(values);
	}

	/**
	 * Adds GeoPoint filter conditions to a Mongoose query.
	 * @param filter - The filter descriptor from the admin UI.
	 * @returns A Mongoose-compatible filter object.
	 */
	addFilterToQuery (filter: KSAdminUiFilterForGeoPointField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		const lon = Number(filter.lon);
		const lat = Number(filter.lat);
		if (filter.lon != null && filter.lon !== '' && filter.lat != null && filter.lat !== '' && Number.isFinite(lon) && Number.isFinite(lat)) {
			const near: Record<string, unknown> = {
				$geometry: { type: 'Point', coordinates: [lon, lat] },
			};
			const rawValue = filter.distance?.value;
			const distance = (rawValue != null && rawValue !== '' && Number(rawValue) !== 0)
				? Number(rawValue) * 1000
				: 500000;
			if (filter.distance?.mode === 'min') {
				near.$minDistance = distance;
			} else {
				near.$maxDistance = distance;
			}
			query[this.path] = { $near: near };
		}
		return query;
	}

	/**
	 * Updates the document from submitted GeoPoint data.
	 * @param item - The Mongoose document to update.
	 * @param data - The submitted form data.
	 * @param callback - Callback on completion.
	 * @returns Nothing.
	 */
	override updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const value = this.getValueFromData(data);
		if (value === undefined) return process.nextTick(callback);
		if (typeof value === 'string') {
			const values = REGEXP_LNGLAT.exec(value);
			if (values) {
				item.set(this.path, [values[1], values[2]]);
			} else {
				item.set(this.path, undefined);
			}
		} else if (Array.isArray(value)) {
			if (value.length === 2 && REGEXP_LNGLAT.test(value.filter(Boolean).join(','))) {
				item.set(this.path, value);
			} else {
				item.set(this.path, undefined);
			}
		}
		process.nextTick(callback);
	}
}

// Static prototype properties not expressible as class members
(GeoPointType.prototype as unknown as { _fixedSize: string })._fixedSize = 'medium';

export default GeoPointType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the GeoPoint field type
// ---------------------------------------------------------------------------

/**
 * Options bag for the GeoPoint field type constructor.
 */
export interface KeystoneFieldOptionsForGeoPointType extends FieldOptionsBase {
	/** Reserved for field registry use — binds this options bag to the GeoPoint type. */
	type?: unknown;
}

/**
 * Backward-compatibility alias — prefer importing `GeoPointType` directly.
 */
export type KeystoneFieldForGeoPointType = GeoPointType;

/**
 * Constructor type for the GeoPoint field type.
 */
export type KeystoneTypeConstructorForGeoPointType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForGeoPointType) => GeoPointType;
