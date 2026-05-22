/**
 * @file FieldSpec — discriminated union of all 29 field specifications.
 *
 * Each union variant intersects a field-options interface with `{ type: typeof XType }`,
 * so TypeScript narrows to the correct options when a specific constructor is passed.
 *
 * Consumed by `lib/list/add.mts` and the `KeystoneList.add()` signature in `lib/list.mts`.
 */

import type BooleanType from './boolean/BooleanType.mjs';
import type { KeystoneFieldOptionsForBooleanType } from './boolean/BooleanType.mjs';

import type CloudinaryType from './cloudinary/CloudinaryType.mjs';
import type { KeystoneFieldOptionsForCloudinaryType } from './cloudinary/CloudinaryType.mjs';

import type CloudinaryImageType from './cloudinaryimage/CloudinaryImageType.mjs';
import type { KeystoneFieldOptionsForCloudinaryImageType } from './cloudinaryimage/CloudinaryImageType.mjs';

import type CloudinaryImagesType from './cloudinaryimages/CloudinaryImagesType.mjs';
import type { KeystoneFieldOptionsForCloudinaryImagesType } from './cloudinaryimages/CloudinaryImagesType.mjs';

import type CodeType from './code/CodeType.mjs';
import type { KeystoneFieldOptionsForCodeType } from './code/CodeType.mjs';

import type ColorType from './color/ColorType.mjs';
import type { KeystoneFieldOptionsForColorType } from './color/ColorType.mjs';

import type DateType from './date/DateType.mjs';
import type { KeystoneFieldOptionsForDateType } from './date/DateType.mjs';

import type DateArrayType from './datearray/DateArrayType.mjs';
import type { KeystoneFieldOptionsForDateArrayType } from './datearray/DateArrayType.mjs';

import type DatetimeType from './datetime/DatetimeType.mjs';
import type { KeystoneFieldOptionsForDateTimeType } from './datetime/DatetimeType.mjs';

import type EmailType from './email/EmailType.mjs';
import type { KeystoneFieldOptionsForEmailType } from './email/EmailType.mjs';

import type FileType from './file/FileType.mjs';
import type { KeystoneFieldOptionsForFileType } from './file/FileType.mjs';

import type GeoPointType from './geopoint/GeoPointType.mjs';
import type { KeystoneFieldOptionsForGeoPointType } from './geopoint/GeoPointType.mjs';

import type HtmlType from './html/HtmlType.mjs';
import type { KeystoneFieldOptionsForHtmlType } from './html/HtmlType.mjs';

import type KeyType from './key/KeyType.mjs';
import type { KeystoneFieldOptionsForKeyType } from './key/KeyType.mjs';

import type LocationType from './location/LocationType.mjs';
import type { KeystoneFieldOptionsForLocationType } from './location/LocationType.mjs';

import type MarkdownType from './markdown/MarkdownType.mjs';
import type { KeystoneFieldOptionsForMarkdownType } from './markdown/MarkdownType.mjs';

import type MoneyType from './money/MoneyType.mjs';
import type { KeystoneFieldOptionsForMoneyType } from './money/MoneyType.mjs';

import type NameType from './name/NameType.mjs';
import type { KeystoneFieldOptionsForNameType } from './name/NameType.mjs';

import type NumberType from './number/NumberType.mjs';
import type { KeystoneFieldOptionsForNumberType } from './number/NumberType.mjs';

import type NumberArrayType from './numberarray/NumberArrayType.mjs';
import type { KeystoneFieldOptionsForNumberArrayType } from './numberarray/NumberArrayType.mjs';

import type PasswordType from './password/PasswordType.mjs';
import type { KeystoneFieldOptionsForPasswordType } from './password/PasswordType.mjs';

import type RelationshipType from './relationship/RelationshipType.mjs';
import type { KeystoneFieldOptionsForRelationshipType } from './relationship/RelationshipType.mjs';

import type SelectType from './select/SelectType.mjs';
import type { KeystoneFieldOptionsForSelectType } from './select/SelectType.mjs';

import type TextType from './text/TextType.mjs';
import type { KeystoneFieldOptionsForTextType } from './text/TextType.mjs';

import type TextArrayType from './textarray/TextArrayType.mjs';
import type { KeystoneFieldOptionsForTextArrayType } from './textarray/TextArrayType.mjs';

import type TextareaType from './textarea/TextareaType.mjs';
import type { KeystoneFieldOptionsForTextareaType } from './textarea/TextareaType.mjs';

import type UrlType from './url/UrlType.mjs';
import type { KeystoneFieldOptionsForUrlType } from './url/UrlType.mjs';

import type { CloudinaryImageData } from './cloudinary/CloudinaryType.mjs';
import type { FileValue } from './file/FileType.mjs';
import type { LocationData } from './location/LocationType.mjs';
import type { MarkdownValue } from './markdown/MarkdownType.mjs';
import type { NameValue } from './name/NameType.mjs';

/**
 * Maps a `FieldSpec` discriminant to the concrete field instance type it produces.
 *
 * Given a spec `S extends FieldSpec`, `FieldInstanceFor<S>` resolves to the class
 * instance type of the field constructor identified by `S.type`. This enables
 * typed `list.fields[P]` access when `TFields` is known:
 *
 * ```ts
 * type EmailField = FieldInstanceFor<{ type: typeof EmailType; required: true }>;
 * //   ^? EmailType
 * ```
 *
 * For the four Mongoose-native constructors (String, Number, Boolean, Date) there
 * is no Keystone field class — the conditional falls through to `never`, which is
 * acceptable since those paths are never accessed as typed field instances.
 */
export type FieldInstanceFor<S extends FieldSpec> =
	S extends { type: typeof BooleanType } ? BooleanType :
	S extends { type: typeof CloudinaryImageType } ? CloudinaryImageType :
	S extends { type: typeof CloudinaryImagesType } ? CloudinaryImagesType :
	S extends { type: typeof CloudinaryType } ? CloudinaryType :
	S extends { type: typeof CodeType } ? CodeType :
	S extends { type: typeof ColorType } ? ColorType :
	S extends { type: typeof DateType } ? DateType :
	S extends { type: typeof DateArrayType } ? DateArrayType :
	S extends { type: typeof DatetimeType } ? DatetimeType :
	S extends { type: typeof EmailType } ? EmailType :
	S extends { type: typeof FileType } ? FileType :
	S extends { type: typeof GeoPointType } ? GeoPointType :
	S extends { type: typeof HtmlType } ? HtmlType :
	S extends { type: typeof KeyType } ? KeyType :
	S extends { type: typeof LocationType } ? LocationType :
	S extends { type: typeof MarkdownType } ? MarkdownType :
	S extends { type: typeof MoneyType } ? MoneyType :
	S extends { type: typeof NameType } ? NameType :
	S extends { type: typeof NumberType } ? NumberType :
	S extends { type: typeof NumberArrayType } ? NumberArrayType :
	S extends { type: typeof PasswordType } ? PasswordType :
	S extends { type: typeof RelationshipType } ? RelationshipType :
	S extends { type: typeof SelectType } ? SelectType :
	S extends { type: typeof TextType } ? TextType :
	S extends { type: typeof TextArrayType } ? TextArrayType :
	S extends { type: typeof TextareaType } ? TextareaType :
	S extends { type: typeof UrlType } ? UrlType :
	never;

/**
 * Maps a FieldSpec to the runtime value type stored in the Mongoose document.
 *
 * Used by `DocumentFor<TFields>` to compute the document shape from a field
 * registry. Each arm matches the same discriminant as `FieldInstanceFor<S>`.
 *
 * For the four Mongoose-native constructors (String, Number, Boolean, Date) the
 * value type maps to the corresponding TypeScript primitive.
 */
export type FieldValueFor<S extends FieldSpec> =
	S extends { type: typeof BooleanType } ? boolean :
	S extends { type: typeof ColorType } ? string :
	S extends { type: typeof CodeType } ? string :
	S extends { type: typeof CloudinaryImageType } ? CloudinaryImageData :
	S extends { type: typeof CloudinaryImagesType } ? CloudinaryImageData[] :
	S extends { type: typeof CloudinaryType } ? CloudinaryImageData :
	S extends { type: typeof DateType } ? Date | string | undefined :
	S extends { type: typeof DateArrayType } ? Date[] :
	S extends { type: typeof DatetimeType } ? Date | string | undefined :
	S extends { type: typeof EmailType } ? string :
	S extends { type: typeof FileType } ? FileValue :
	S extends { type: typeof GeoPointType } ? number[] :
	S extends { type: typeof HtmlType } ? string :
	S extends { type: typeof KeyType } ? string :
	S extends { type: typeof LocationType } ? LocationData :
	S extends { type: typeof MarkdownType } ? MarkdownValue :
	S extends { type: typeof MoneyType } ? number :
	S extends { type: typeof NameType } ? NameValue :
	S extends { type: typeof NumberType } ? number :
	S extends { type: typeof NumberArrayType } ? number[] :
	S extends { type: typeof PasswordType } ? string :
	S extends { type: typeof RelationshipType } ? string | string[] :
	S extends { type: typeof SelectType } ? string | number :
	S extends { type: typeof TextType } ? string :
	S extends { type: typeof TextArrayType } ? string[] :
	S extends { type: typeof TextareaType } ? string :
	S extends { type: typeof UrlType } ? string :
	// Mongoose-native constructors used directly as the type discriminant:
	S extends { type: StringConstructor } ? string :
	S extends { type: NumberConstructor } ? number :
	S extends { type: BooleanConstructor } ? boolean :
	S extends { type: DateConstructor } ? Date :
	unknown;

/**
 * Computes the Mongoose document shape from a TFields registry.
 *
 * Each field path `P` maps to `FieldValueFor<TFields[P]>`, producing a typed
 * document object where `doc.email: string`, `doc.name: NameValue`, etc.
 *
 * Used to type `list.model` as `mongoose.Model<DocumentFor<TFields>>`, which
 * makes `list.model.findOne({ wrongField: 'x' })` a compile error when TFields
 * is populated.
 *
 * With the default `TFields = Record<string, FieldSpec>`, this resolves to
 * `{ [key: string]: FieldValueFor<FieldSpec> }` — a union of all value types —
 * keeping all untyped callers compiling without changes.
 *
 * @example
 * ```ts
 * type UserDoc = DocumentFor<{
 *   email: { type: typeof EmailType };
 *   name: { type: typeof NameType };
 * }>;
 * // => { email: string; name: NameValue }
 * ```
 */
export type DocumentFor<TFields extends Record<string, FieldSpec>> = {
	[P in keyof TFields]: FieldValueFor<TFields[P]>;
};

/**
 * Internal type alias for list keys — avoids a circular import from lib/list.mts
 * (which imports FieldSpec.mts). Mirrors the `ListKey` alias in lib/list.mts.
 *
 * When `KeystoneLists` is empty (keystone4-ts itself), resolves to `string & {}`.
 * When consumers populate the interface, includes the registered key literals.
 */
type FilterListKey = keyof KeystoneLists | (string & {});

/**
 * Filter clause for a `Types.Relationship` field. The keys must be field paths
 * on the referenced list (`TRef`), and the values are constraints on those fields.
 *
 * When `KeystoneLists` is populated and `TRef` is a known key whose list value
 * carries a `fields` property, `Filters` narrows to
 * `Partial<{ [P in keyof TTargetFields]: unknown }>` — only the declared field
 * paths are permitted as filter keys.
 *
 * In all other cases (unknown list key, or list value without a `fields`
 * property) it falls back to `Record<string, unknown>`, accepting any filter.
 *
 * Uses structural duck-typing (`extends { fields: infer TTargetFields }`) rather
 * than importing `KeystoneList` directly, which would create a circular import
 * (`lib/list.mts` → `FieldSpec.mts` → `lib/list.mts`).
 *
 * @example
 * ```ts
 * // With KeystoneLists.User having fields { name, email }:
 * const f: Filters<'User'> = { email: 'x' };      // OK
 * const g: Filters<'User'> = { typo: 'x' };       // compile error
 *
 * // Without KeystoneLists populated (fallback):
 * const h: Filters<'Unknown'> = { anything: 1 };  // OK
 * ```
 */
export type Filters<TRef extends FilterListKey> =
	TRef extends keyof KeystoneLists
		? KeystoneLists[TRef] extends { fields: infer TTargetFields }
			? TTargetFields extends Record<string, unknown>
				? Partial<{ [P in keyof TTargetFields]: unknown }>
				: Record<string, unknown>
			: Record<string, unknown>
		: Record<string, unknown>;

/**
 * Discriminated union of all 27 active field specifications (plus 4 Mongoose native types).
 *
 * Each variant has a `type:` discriminant pointing to a specific field-type constructor.
 * TypeScript narrows to the matching options interface based on which constructor is passed.
 *
 * Generics with default type parameters (RelationshipType, SelectType) use their defaults
 * so the union member accepts any valid ref/value narrowing at the call site.
 *
 * Note: `LocalFileType` and `LocalFilesType` are removed field types (they throw on
 * construction) and are intentionally excluded from this union.
 */
export type FieldSpec =
	| (KeystoneFieldOptionsForBooleanType & { type: typeof BooleanType })
	| (KeystoneFieldOptionsForCloudinaryType & { type: typeof CloudinaryType })
	| (KeystoneFieldOptionsForCloudinaryImageType & { type: typeof CloudinaryImageType })
	| (KeystoneFieldOptionsForCloudinaryImagesType & { type: typeof CloudinaryImagesType })
	| (KeystoneFieldOptionsForCodeType & { type: typeof CodeType })
	| (KeystoneFieldOptionsForColorType & { type: typeof ColorType })
	| (KeystoneFieldOptionsForDateType & { type: typeof DateType })
	| (KeystoneFieldOptionsForDateArrayType & { type: typeof DateArrayType })
	| (KeystoneFieldOptionsForDateTimeType & { type: typeof DatetimeType })
	| (KeystoneFieldOptionsForEmailType & { type: typeof EmailType })
	| (KeystoneFieldOptionsForFileType & { type: typeof FileType })
	| (KeystoneFieldOptionsForGeoPointType & { type: typeof GeoPointType })
	| (KeystoneFieldOptionsForHtmlType & { type: typeof HtmlType })
	| (KeystoneFieldOptionsForKeyType & { type: typeof KeyType })
	| (KeystoneFieldOptionsForLocationType & { type: typeof LocationType })
	| (KeystoneFieldOptionsForMarkdownType & { type: typeof MarkdownType })
	| (KeystoneFieldOptionsForMoneyType & { type: typeof MoneyType })
	| (KeystoneFieldOptionsForNameType & { type: typeof NameType })
	| (KeystoneFieldOptionsForNumberType & { type: typeof NumberType })
	| (KeystoneFieldOptionsForNumberArrayType & { type: typeof NumberArrayType })
	| (KeystoneFieldOptionsForPasswordType & { type: typeof PasswordType })
	| (KeystoneFieldOptionsForRelationshipType & { type: typeof RelationshipType })
	| (KeystoneFieldOptionsForSelectType & { type: typeof SelectType })
	| (KeystoneFieldOptionsForTextType & { type: typeof TextType })
	| (KeystoneFieldOptionsForTextArrayType & { type: typeof TextArrayType })
	| (KeystoneFieldOptionsForTextareaType & { type: typeof TextareaType })
	| (KeystoneFieldOptionsForUrlType & { type: typeof UrlType })
	/** Mongoose native types used directly as the type discriminant (e.g. `{ type: String }`). */
	| { type: StringConstructor; [key: string]: unknown }
	| { type: NumberConstructor; [key: string]: unknown }
	| { type: BooleanConstructor; [key: string]: unknown }
	| { type: DateConstructor; [key: string]: unknown };

/**
 * Map shape for a single call to `List.add(...)`.
 *
 * Keys are field paths; values are either a `FieldSpec` (a field definition) or a nested
 * `FieldMap` (a plain-object grouping that becomes a nested schema path).
 *
 * A nested `FieldMap` is distinguished at runtime by the absence of a `type` property
 * (or when `type.type` is present, per Keystone's nesting detection heuristic).
 */
export type FieldMap = {
	[path: string]: FieldSpec | FieldMap;
};

/**
 * A single argument accepted by `List.add(...)`.
 *
 * - `string` — a plain heading label (special-cased to `'>>>'` / `'<<<'` for indent/outdent)
 * - `{ heading: string; ... }` — a heading object with optional `dependsOn`
 * - `FieldMap` — an object whose own keys are field paths mapping to `FieldSpec` or nested `FieldMap`
 */
export type AddArg = string | { heading: string; [key: string]: unknown } | FieldMap;
