import type { FieldMap } from '../fields/types/FieldSpec.mjs';

type UnionToIntersection<T> = (T extends unknown ? (value: T) => void : never) extends (
	value: infer TIntersection,
) => void
	? TIntersection
	: never;

type FieldGroupFieldsUnion<TGroups extends readonly KeystoneFieldGroup<object>[]> =
	TGroups[number] extends { fields: infer TFields }
		? TFields extends object
			? TFields
			: never
		: never;

/**
 * A logical group of Keystone fields with optional Admin UI heading metadata.
 *
 * `dependsOn` and additional metadata keys are preserved on the group object for
 * consumer-side Admin UI logic. Keystone's helper only reads `heading` and
 * `fields` when adding grouped fields to a list.
 */
export interface KeystoneFieldGroup<TFields extends object = FieldMap> {
	/** Optional heading rendered before this group in the legacy Admin UI form. */
	heading?: string;
	/** Optional consumer metadata for conditional group visibility. */
	dependsOn?: Record<string, readonly unknown[] | undefined>;
	/** Field definitions registered by this group. */
	fields: TFields;
	/** Additional consumer metadata carried alongside the field group. */
	[metadataKey: string]: unknown;
}

/**
 * Minimal Keystone list shape needed to register field groups.
 *
 * This keeps `addFieldGroups` compatible with both document-generic lists and
 * field-inferred lists while still requiring Keystone's legacy `list.add`
 * field-map and heading forms.
 */
export interface KeystoneFieldGroupList {
	/** Register a heading section followed by its field map. */
	add(options: { heading: string }, fields: FieldMap): unknown;
	/** Register a plain field map. */
	add(fields: FieldMap): unknown;
}

/**
 * Converts a readonly field-group tuple to the combined field map type it
 * represents.
 *
 * @template TGroups - Field-group tuple to flatten at the type level.
 */
export type KeystoneFieldGroupsToFields<TGroups extends readonly KeystoneFieldGroup<object>[]> =
	UnionToIntersection<FieldGroupFieldsUnion<TGroups>>;

/**
 * Compatibility alias for {@link KeystoneFieldGroupsToFields}.
 *
 * @template TGroups - Field-group tuple to flatten at the type level.
 */
export type FieldGroupsToFields<TGroups extends readonly KeystoneFieldGroup<object>[]> =
	KeystoneFieldGroupsToFields<TGroups>;

/**
 * Optional constraint marker for consumers that want a field-group collection
 * to be associated with a known flat Keystone field map.
 *
 * @template TFields - Flat field map represented by the grouped definitions.
 */
export type KeystoneFieldGroupsConstraint<TFields extends FieldMap> = readonly KeystoneFieldGroup[] & {
	readonly __fieldsConstraint?: TFields;
};

/**
 * Optional constraint marker for consumers that want a field-group collection
 * to be associated with a document/value shape instead of a Keystone field map.
 *
 * @template TDocumentFields - Document/value fields represented by the grouped definitions.
 */
export type KeystoneFieldGroupsDocumentConstraint<TDocumentFields extends object> =
	readonly KeystoneFieldGroup<object>[] & {
		readonly __documentFieldsConstraint?: TDocumentFields;
	};

/**
 * Flattens grouped field definitions into a single field map.
 *
 * Later groups override earlier groups at runtime when they define the same
 * field path, matching normal object-spread semantics.
 *
 * @param fieldGroups - Field groups to flatten.
 * @returns A combined field map suitable for typed field inference.
 */
export function flattenFieldGroups<TGroups extends readonly KeystoneFieldGroup<object>[]>(
	fieldGroups: TGroups,
): KeystoneFieldGroupsToFields<TGroups> {
	let fields: object = {};

	for (const group of fieldGroups) {
		fields = { ...fields, ...group.fields };
	}

	return fields as KeystoneFieldGroupsToFields<TGroups>;
}

/**
 * Cloom-style alias for {@link flattenFieldGroups}.
 *
 * @param fieldGroups - Field groups to flatten.
 * @returns A combined field map suitable for typed field inference.
 */
export function transformFieldGroupsToFields<TGroups extends readonly KeystoneFieldGroup<object>[]>(
	fieldGroups: TGroups,
): KeystoneFieldGroupsToFields<TGroups> {
	return flattenFieldGroups(fieldGroups);
}

/**
 * Adds grouped field definitions to a Keystone list.
 *
 * Groups with `heading` are registered as `list.add({ heading }, fields)`,
 * preserving the legacy Admin UI section behavior. Groups without `heading`
 * are registered as plain `list.add(fields)`.
 *
 * @param list - Keystone list receiving the grouped fields.
 * @param fieldGroups - Field groups to register.
 * @returns The original list for fluent setup chains.
 */
export function addFieldGroups<TList extends KeystoneFieldGroupList>(
	list: TList,
	fieldGroups: readonly KeystoneFieldGroup<object>[],
): TList {
	for (const group of fieldGroups) {
		const fields = group.fields as FieldMap;

		if (group.heading) {
			list.add({ heading: group.heading }, fields);
		} else {
			list.add(fields);
		}
	}

	return list;
}

/**
 * Cloom-style alias for {@link addFieldGroups}.
 *
 * @param list - Keystone list receiving the grouped fields.
 * @param fieldGroups - Field groups to register.
 * @returns The original list for fluent setup chains.
 */
export function addFieldGroupsToKeystoneList<TList extends KeystoneFieldGroupList>(
	list: TList,
	fieldGroups: readonly KeystoneFieldGroup<object>[],
): TList {
	return addFieldGroups(list, fieldGroups);
}
