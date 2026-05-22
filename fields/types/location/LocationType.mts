import _ from 'lodash';
import { FieldType } from '../Type.mjs';
import type { MongooseDocument, KeystoneList, FieldOptionsBase } from '../Type.mjs';
import type { Schema } from 'mongoose';
import https from 'node:https';
import keystone from '../../../index.mjs';
import querystring from 'node:querystring';
import { defer } from '../../../lib/utils/async.mjs';
import { number } from '../../../lib/utils/number.mjs';
import { escapeRegExp } from '../../../lib/utils/regexp.mjs';

const RADIUS_KM = 6371;
const RADIUS_MILES = 3959;

// ---------------------------------------------------------------------------
// Shared interfaces
// ---------------------------------------------------------------------------

/** All sub-field paths managed by the location field (string index included for dynamic lookup). */
export interface LocationPaths {
	number: string;
	name: string;
	street1: string;
	street2: string;
	suburb: string;
	state: string;
	postcode: string;
	country: string;
	geo: string;
	geo_lat: string;
	geo_lng: string;
	serialised: string;
	improve: string;
	overwrite: string;
	[key: string]: string;
}

/**
 * Structured location data built during a Google geocode response.
 * `street1` is accumulated as `string[]` then joined to `string` before return.
 * The index signature allows keyed access in `_.forEach` loops.
 */
export interface LocationData {
	number?: string;
	name?: string;
	street1?: string | string[];
	street2?: string;
	suburb?: string;
	state?: string;
	postcode?: string;
	country?: string;
	geo?: number[];
	[key: string]: unknown;
}

/**
 * Normalised internal options for LocationType.
 * After normalisation in the constructor, `required` is always `boolean | (() => boolean)`.
 * This satisfies the `FieldOptionsBase` constraint so it can be used as a generic parameter.
 */
interface LocationFieldOptionsNormalised extends FieldOptionsBase {
	enableImprove?: boolean;
	defaults?: Record<string, unknown>;
	/** Reserved for field registry use. */
	type?: unknown;
}

/** Filter shape passed to `addFilterToQuery`. */
export interface KSAdminUiFilterForLocationField {
	street?: string;
	city?: string;
	state?: string;
	code?: string;
	country?: string;
	inverted?: boolean;
}

/** Single address component from the Google Maps Geocoding API response. */
interface GeocodeAddressComponent {
	long_name: string;
	short_name: string;
	types: string[];
}

/** Single result entry from the Google Maps Geocoding API response. */
interface GeocodeResult {
	address_components: GeocodeAddressComponent[];
	geometry: {
		location: { lat: number; lng: number };
	};
}

/** Full response body from the Google Maps Geocoding API. */
interface GeocodeResponse {
	status: string;
	error_message?: string;
	results: GeocodeResult[];
	/** Present only in synthetic error objects built from catch blocks. */
	status_code?: number;
	status_text?: string;
}

// ---------------------------------------------------------------------------
// Constructor
// ---------------------------------------------------------------------------

/**
 * Stores a structured postal address with sub-fields for number, name, street
 * lines, suburb, state, postcode, country, and geo-coordinates. Can be
 * configured to call the Google Maps Geocoding API to normalise addresses.
 * Exposes `format`, `googleLookup`, `kmFrom`, and `milesFrom` underscore methods.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration; may include `enableImprove` (Google Maps)
 *                and `required` (array or string of required sub-field paths).
 */
class LocationType extends FieldType<LocationFieldOptionsNormalised, LocationData> {
	static readonly properName = 'Location';
	static readonly typeName = 'location';

	declare enableMapsAPI: boolean;
	declare requiredPaths: string[];
	declare paths: LocationPaths;
	declare paths_improve: string;
	declare paths_improve_overwrite: string;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForLocationType) {
		if ('geocodeGoogle' in options) {
			throw new Error('The geocodeGoogle option for Location fields has been renamed to enableImprove');
		}
		options.defaults ??= {};
		let requiredPaths: string[] | undefined;
		if (options.required) {
			if (Array.isArray(options.required)) {
				requiredPaths = options.required;
			} else if (typeof options.required === 'string') {
				requiredPaths = options.required.replace(/,/g, ' ').split(/\s+/);
			}
			options.required = true;
		}
		// After normalisation, `required` is boolean | (() => boolean) — cast to normalised shape.
		super(list, path, options as LocationFieldOptionsNormalised);
		this.enableMapsAPI = (options.enableImprove === true || (options.enableImprove !== false && keystone.get('google server api key'))) ? true : false;
		this.requiredPaths = requiredPaths ?? ['street1', 'suburb'];
	}

	override addToSchema (schema: Schema): void {
		const field = this;
		const options = this.options;

		const paths: LocationPaths = this.paths = {
			number: this.path + '.number',
			name: this.path + '.name',
			street1: this.path + '.street1',
			street2: this.path + '.street2',
			suburb: this.path + '.suburb',
			state: this.path + '.state',
			postcode: this.path + '.postcode',
			country: this.path + '.country',
			geo: this.path + '.geo',
			geo_lat: this.path + '.geo_lat',
			geo_lng: this.path + '.geo_lng',
			serialised: this.path + '.serialised',
			improve: this.path + '_improve',
			overwrite: this.path + '_improve_overwrite',
		};

		this.paths_improve = paths.improve;
		this.paths_improve_overwrite = paths.overwrite;

		const getFieldDef = function (type: unknown, key: string): { type: unknown; default?: unknown } {
			const def: { type: unknown; default?: unknown } = { type: type };
			if (options.defaults?.[key]) {
				def.default = options.defaults[key];
			}
			return def;
		};

		(schema as Schema & { nested: Record<string, boolean> }).nested[this.path] = true;
		schema.add({
			number: getFieldDef(String, 'number'),
			name: getFieldDef(String, 'name'),
			street1: getFieldDef(String, 'street1'),
			street2: getFieldDef(String, 'street2'),
			street3: getFieldDef(String, 'street3'),
			suburb: getFieldDef(String, 'suburb'),
			state: getFieldDef(String, 'state'),
			postcode: getFieldDef(String, 'postcode'),
			country: getFieldDef(String, 'country'),
			geo: { type: [Number], index: '2dsphere' },
		}, this.path + '.');

		schema.virtual(paths.serialised).get(function (this: MongooseDocument) {
			return _.compact([
				this.get(paths.number),
				this.get(paths.name),
				this.get(paths.street1),
				this.get(paths.street2),
				this.get(paths.suburb),
				this.get(paths.state),
				this.get(paths.postcode),
				this.get(paths.country),
			]).join(', ');
		});

		schema.pre('save', function (this: MongooseDocument, next: () => void) {
			const obj = field._path.get(this as MongooseDocument & Record<string, unknown>) as LocationData;
			const geo = (obj.geo ?? []).map(Number).filter(n => _.isFinite(n));
			obj.geo = (geo.length === 2) ? geo : undefined;
			next();
		});

		this.bindUnderscoreMethods();
	}

	addFilterToQuery (filter: KSAdminUiFilterForLocationField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		const field = this;
		(['street', 'city', 'state', 'code', 'country'] as const).forEach(function (i) {
			const filterVal = filter[i];
			if (!filterVal) {
				return;
			}
			let value: string | RegExp = escapeRegExp(filterVal);
			value = new RegExp(value, 'i');
			query[field.paths[FILTER_PATH_MAP[i]]] = filter.inverted ? { $not: value } : value;
		});
		return query;
	}

	override format (item: MongooseDocument, values?: string, delimiter?: string): string {
		if (!values) {
			return item.get(this.paths.serialised) as string;
		}
		const paths: LocationPaths = this.paths;
		const parts = values.split(' ').map(function (i: string) {
			return item.get(paths[i] ?? '');
		});
		return _.compact(parts).join(delimiter || ', ');
	}

	override isModified (item: MongooseDocument): boolean {
		return item.isModified(this.paths.number)
			|| item.isModified(this.paths.name)
			|| item.isModified(this.paths.street1)
			|| item.isModified(this.paths.street2)
			|| item.isModified(this.paths.suburb)
			|| item.isModified(this.paths.state)
			|| item.isModified(this.paths.postcode)
			|| item.isModified(this.paths.country)
			|| item.isModified(this.paths.geo);
	}

	getInputFromData (data: Record<string, unknown>): LocationData {
		let input = this.getValueFromData(data) as LocationData | undefined;
		input ??= {
			number: data[this.paths.number] as string | undefined,
			name: data[this.paths.name] as string | undefined,
			street1: data[this.paths.street1] as string | undefined,
			street2: data[this.paths.street2] as string | undefined,
			suburb: data[this.paths.suburb] as string | undefined,
			state: data[this.paths.state] as string | undefined,
			postcode: data[this.paths.postcode] as string | undefined,
			country: data[this.paths.country] as string | undefined,
			geo: data[this.paths.geo] as number[] | undefined,
			geo_lat: data[this.paths.geo_lat],
			geo_lng: data[this.paths.geo_lng],
			improve: data[this.paths_improve],
			overwrite: data[this.paths_improve_overwrite],
		};
		return input;
	}

	override validateInput (_data: Record<string, unknown>, callback: (result: boolean) => void): void {
		defer(callback, true);
	}

	override validateRequiredInput (item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		let result = true;
		const input = this.getInputFromData(data);
		const currentValue = item.get(this.path) as LocationData;
		this.requiredPaths.forEach(function (path: string) {
			if (input[path] === undefined && currentValue[path]) return;
			if (!input[path]) result = false;
		});
		defer(callback, result);
	}

	override inputIsValid (data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		if (!required) return true;
		const paths: LocationPaths = this.paths;
		const nested = this._path.get(data) as LocationData | undefined;
		const values: Record<string, unknown> = nested ?? data;
		let valid = true;
		this.requiredPaths.forEach(function (path: string) {
			if (nested) {
				if (!(path in values) && item?.get(paths[path] ?? '')) return;
				if (!values[path]) valid = false;
			} else {
				if (!((paths[path] ?? '') in values) && item?.get(paths[path] ?? '')) return;
				if (!values[paths[path] ?? '']) valid = false;
			}
		});
		return valid;
	}

	override updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const paths: LocationPaths = this.paths;
		const fieldKeys = ['number', 'name', 'street1', 'street2', 'suburb', 'state', 'postcode', 'country'] as const;
		const geoKeys = ['geo', 'geo_lat', 'geo_lng'] as const;
		type LocationValueKey = typeof fieldKeys[number] | typeof geoKeys[number];
		const valueKeys: LocationValueKey[] = [...fieldKeys, ...geoKeys];
		// valuePaths maps each logical key to the lookup key within `values`.
		// Nested: keys map to themselves. Flat: keys map to their full dot-path.
		let valuePaths: Record<string, string>;
		let values: Record<string, unknown>;
		const nested = this._path.get(data) as Record<string, unknown> | undefined;

		if (nested) {
			values = nested;
			valuePaths = _.zipObject(valueKeys, valueKeys);
		} else {
			const flatPaths: string[] = valueKeys.map(function (k: LocationValueKey): string {
				return paths[k];
			});
			values = _.pick(data, flatPaths);
			valuePaths = _.zipObject(valueKeys, flatPaths);
		}

		const setValue = function (key: typeof fieldKeys[number]): void {
			const vp = valuePaths[key];
			const pathStr = paths[key];
			if (vp === undefined) return;
			if (vp in values && values[vp] !== item.get(pathStr)) {
				item.set(pathStr, values[vp] ?? null);
			}
		};
		fieldKeys.forEach(setValue);

		type GeoPathKey = typeof geoKeys[number];
		const geoPathEntries = valuePaths as Record<GeoPathKey, string>;
		const geoVP = geoPathEntries.geo;
		const geoLatVP = geoPathEntries.geo_lat;
		const geoLngVP = geoPathEntries.geo_lng;

		if (geoVP in values) {
			const rawGeo = item.get(paths.geo) as number[] | undefined;
			const oldGeo = rawGeo ?? [];
			if (oldGeo.length > 1) {
				const first = oldGeo[0];
				const second = oldGeo[1];
				if (first !== undefined && second !== undefined) {
					oldGeo[0] = second;
					oldGeo[1] = first;
				}
			}
			const candidate = values[geoVP];
			let newGeo: unknown[] = [];
			if (Array.isArray(candidate) && candidate.length === 2) {
				newGeo = candidate;
			}
			const newGeoArr = newGeo as number[];
			const next0 = newGeoArr[0];
			const next1 = newGeoArr[1];
			if (next0 !== oldGeo[0] || next1 !== oldGeo[1]) {
				item.set(paths.geo, newGeo);
			}
		} else if (geoLatVP in values && geoLngVP in values) {
			const lat = number(values[geoLatVP]);
			const lng = number(values[geoLngVP]);
			item.set(paths.geo, (lat && lng) ? [lng, lat] : undefined);
		}

		const doGoogleLookup = this.getValueFromData(data, '_improve');
		if (doGoogleLookup) {
			const googleUpdateMode = this.getValueFromData(data, '_improve_overwrite') ? 'overwrite' : true;
			this.googleLookup(item, false, googleUpdateMode, function (err: unknown) {
				if (err) console.error(err);
				callback();
			});
			return;
		}
		process.nextTick(callback);
	}

	googleLookup (
		item: MongooseDocument,
		region: string | false | null,
		update: boolean | string | ((err: unknown) => void),
		callback: (err: unknown, loc?: LocationData, result?: GeocodeResult) => void,
	): void {
		if (typeof update === 'function') {
			callback = update;
			update = false;
		}
		const field = this;
		const stored = item.get(this.path) as LocationData;
		const address = item.get(this.paths.serialised) as string;
		if (address.length === 0) {
			return callback({ status_code: 500, status_text: 'No address to geocode', status: 'NO_ADDRESS' });
		}
		const defaultRegion = keystone.get('default region') ?? null;
		doGoogleGeocodeRequest(address, region || defaultRegion, function (err: unknown, geocode?: GeocodeResponse) {
			if (err || geocode?.status !== 'OK') {
				return callback(err ?? new Error((geocode?.status ?? 'UNKNOWN') + ': ' + geocode?.error_message));
			}
			const result: GeocodeResult | undefined = geocode.results[0];
			if (!result) {
				return callback(new Error('Geocoder returned no results'));
			}
			const loc: LocationData = {};
			_.forEach(result.address_components, function (val: GeocodeAddressComponent) {
				if (_.indexOf(val.types, 'street_number') >= 0) {
					if (!Array.isArray(loc.street1)) loc.street1 = [];
					loc.street1.unshift(val.long_name);
				}
				if (_.indexOf(val.types, 'route') >= 0) {
					if (!Array.isArray(loc.street1)) loc.street1 = [];
					loc.street1.push(val.short_name);
				}
				if (_.indexOf(val.types, 'locality') >= 0 && !loc.suburb) { loc.suburb = val.long_name; }
				if (_.indexOf(val.types, 'administrative_area_level_1') >= 0) { loc.state = val.short_name; }
				if (_.indexOf(val.types, 'country') >= 0) { loc.country = val.long_name; }
				if (_.indexOf(val.types, 'postal_code') >= 0) { loc.postcode = val.short_name; }
				if (_.indexOf(val.types, 'subpremise') >= 0) { loc.number = val.short_name; }
				if (_.indexOf(val.types, 'floor') >= 0 || _.indexOf(val.types, 'post_box') >= 0 || _.indexOf(val.types, 'room') >= 0) {
					loc.number = loc.number || val.short_name;
				}
			});
			if (Array.isArray(loc.street1)) { loc.street1 = loc.street1.join(' '); }
			loc.geo = [result.geometry.location.lng, result.geometry.location.lat];
			if (update === 'overwrite') {
				item.set(field.path, loc);
			} else if (update) {
				_.forEach(loc, function (value: unknown, key: string) {
					if (key === 'geo') return;
					if (!stored[key]) { item.set(field.paths[key] as string, value); }
				});
				if (!Array.isArray(stored.geo) || !stored.geo[0] || !stored.geo[1]) {
					item.set(field.paths.geo, loc.geo);
				}
			}
			callback(null, loc, result);
		});
	}

	kmFrom (item: MongooseDocument, point: number[]): number {
		return calculateDistance(item.get(this.paths.geo) as number[], point) * RADIUS_KM;
	}

	milesFrom (item: MongooseDocument, point: number[]): number {
		return calculateDistance(item.get(this.paths.geo) as number[], point) * RADIUS_MILES;
	}
}

// Static prototype properties not expressible as class static members
(LocationType.prototype as unknown as Record<string, unknown>)._underscoreMethods = ['format', 'googleLookup', 'kmFrom', 'milesFrom'];
(LocationType.prototype as unknown as Record<string, unknown>)._fixedSize = 'full';
(LocationType.prototype as unknown as Record<string, unknown>)._properties = ['enableMapsAPI'];

const FILTER_PATH_MAP = {
	street: 'street1',
	city: 'suburb',
	state: 'state',
	code: 'postcode',
	country: 'country',
} as const satisfies Record<string, string>;

function doGoogleGeocodeRequest(
	address: string,
	region: string | ((err: unknown, result?: GeocodeResponse) => void) | null,
	callback: (err: unknown, result?: GeocodeResponse) => void,
): void {
	const options: Record<string, unknown> = { sensor: false, language: 'en', address: address };
	if (arguments.length === 2 && typeof region === 'function') {
		callback = region;
		region = null;
	}
	if (region) {
		options.region = region;
	}
	const googleApiKey = keystone.get('google server api key');
	if (googleApiKey) {
		options.key = googleApiKey;
	}
	const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json?' + querystring.stringify(options as Record<string, string>);
	https.get(endpoint, function (res) {
		const data: Buffer[] = [];
		res.on('data', function (chunk: Buffer) { data.push(chunk); })
			.on('end', function () {
				const dataBuff = data.join('').trim();
				let result: GeocodeResponse;
				try {
					result = JSON.parse(dataBuff) as GeocodeResponse;
				} catch (_exp) {
					result = { status: 'UNKNOWN_ERROR', status_code: 500, status_text: 'JSON Parse Failed', results: [] };
				}
				callback(null, result);
			});
	}).on('error', function (err: Error) {
		callback(err);
	});
}

function calculateDistance(point1: number[], point2: number[]): number {
	if (point1.length < 2 || point2.length < 2) return NaN;
	// Destructuring avoids noUncheckedIndexedAccess lint; length guard above proves positions exist.
	const [p1Lng, p1Lat] = point1 as [number, number, ...number[]];
	const [p2Lng, p2Lat] = point2 as [number, number, ...number[]];
	if (!Number.isFinite(p1Lng) || !Number.isFinite(p1Lat) || !Number.isFinite(p2Lng) || !Number.isFinite(p2Lat)) return NaN;
	const dLng = (p2Lng - p1Lng) * Math.PI / 180;
	const dLat = (p2Lat - p1Lat) * Math.PI / 180;
	const lat1 = p1Lat * Math.PI / 180;
	const lat2 = p2Lat * Math.PI / 180;
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return c;
}

export default LocationType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Location field type
// ---------------------------------------------------------------------------

/**
 * Options bag for the Location field type constructor.
 * Extends FieldOptionsBase but widens `required` to also accept a
 * space/comma-separated string or an array of required sub-field names.
 */
export type KeystoneFieldOptionsForLocationType = Omit<FieldOptionsBase, 'required'> & {
	/**
	 * Enable the Google Maps geocoding integration.
	 * When `true`, or when a Google server API key is configured, enables `googleLookup`.
	 */
	enableImprove?: boolean;
	/**
	 * Default values for sub-fields (e.g. `{ country: 'AU' }`).
	 */
	defaults?: Record<string, unknown>;
	/**
	 * Required sub-fields. Accepts `true`, a space/comma-separated string of
	 * sub-field names, or an array of sub-field names.
	 * Default when required: `['street1', 'suburb']`.
	 */
	required?: boolean | string | string[];
	/** Reserved for field registry use — binds this options bag to the Location type. */
	type?: unknown;
};

/**
 * Backward-compatibility alias — prefer importing `LocationType` directly.
 */
export type KeystoneFieldForLocationType = LocationType;

/**
 * Constructor type for the Location field type.
 */
export type KeystoneTypeConstructorForLocationType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForLocationType) => LocationType;
