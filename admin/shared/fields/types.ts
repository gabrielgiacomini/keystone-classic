import type React from 'react';

// ---------------------------------------------------------------------------
// FieldMeta — discriminated union, one variant per field type
// ---------------------------------------------------------------------------

/**
 * Discriminated union describing the server-side metadata for a single field.
 * The `fieldType` discriminant is the string key used to look up components
 * in the field registry. Each variant carries at minimum `label` and `path`;
 * some variants include additional type-specific properties (e.g. `options`
 * for `select`, `folder` for cloudinary fields).
 */
export type FieldMeta =
  | { fieldType: 'text'; label: string; path: string }
  | { fieldType: 'textarea'; label: string; path: string }
  | { fieldType: 'email'; label: string; path: string }
  | { fieldType: 'url'; label: string; path: string }
  | { fieldType: 'boolean'; label: string; path: string }
  | { fieldType: 'number'; label: string; path: string }
  | { fieldType: 'numberarray'; label: string; path: string }
  | { fieldType: 'password'; label: string; path: string }
  | { fieldType: 'key'; label: string; path: string }
  | { fieldType: 'name'; label: string; path: string }
  | { fieldType: 'code'; label: string; path: string }
  | { fieldType: 'color'; label: string; path: string }
  | {
      fieldType: 'select';
      label: string;
      path: string;
      options: { value: string | number; label: string }[];
      numeric?: boolean;
      emptyOption?: boolean;
    }
  | { fieldType: 'money'; label: string; path: string }
  | { fieldType: 'date'; label: string; path: string }
  | { fieldType: 'datearray'; label: string; path: string }
  | { fieldType: 'datetime'; label: string; path: string }
  | { fieldType: 'markdown'; label: string; path: string }
  | { fieldType: 'location'; label: string; path: string; enableMapsAPI?: boolean }
  | { fieldType: 'geopoint'; label: string; path: string }
  | { fieldType: 'html'; label: string; path: string }
  | { fieldType: 'localfile'; label: string; path: string }
  | { fieldType: 'localfiles'; label: string; path: string }
  | {
      fieldType: 'cloudinaryimage';
      label: string;
      path: string;
      folder?: string;
      filenameAssetKey?: string;
    }
  | {
      fieldType: 'cloudinaryimages';
      label: string;
      path: string;
      folder?: string;
      filenameAssetKey?: string;
    }
  | {
      fieldType: 'cloudinary';
      label: string;
      path: string;
      multiple?: boolean;
      folder?: string;
    }
  | { fieldType: 'relationship'; label: string; path: string; refList: string; many?: boolean; createInline?: boolean }
  | { fieldType: 'file'; label: string; path: string }
  | { fieldType: 'textarray'; label: string; path: string };

// ---------------------------------------------------------------------------
// FieldTypeName — union of all field type discriminant strings
// ---------------------------------------------------------------------------

/** Union of all `fieldType` discriminant strings from {@link FieldMeta}. */
export type FieldTypeName = FieldMeta['fieldType'];

// ---------------------------------------------------------------------------
// Component prop interfaces
// ---------------------------------------------------------------------------

/**
 * Props passed to every Field component (the edit widget). The component is
 * responsible for rendering a form control that reads `value` and calls
 * `onChange` with the new value on user interaction.
 * @template TValue The stored/submitted value type for this field.
 */
export interface FieldProps<TValue> {
  fieldName: string;
  label: string;
  value: TValue;
  onChange: (value: TValue) => void;
  isRequired: boolean;
  isReadonly: boolean;
  errors: string[];
  meta: FieldMeta;
}

/**
 * Props passed to every Filter component (the query/filter widget). The
 * component renders a control for constructing a query expression for this
 * field; the parent passes the current filter `value` and an `onChange` handler.
 * @template TFilterValue The filter expression value type for this field.
 */
export interface FilterProps<TFilterValue> {
  fieldName: string;
  value: TFilterValue;
  onChange: (value: TFilterValue) => void;
  meta: FieldMeta;
}

/**
 * Props passed to every Column component (read-only table cell). The component
 * renders the field value as a non-interactive table cell.
 * @template TValue The value type stored at this field's path.
 */
export interface ColumnProps<TValue> {
  fieldName: string;
  value: TValue;
  meta: FieldMeta;
}

// ---------------------------------------------------------------------------
// FieldComponentSet — the full set of components + metadata for one field type
// ---------------------------------------------------------------------------

/**
 * The complete set of React components and metadata required to render a single
 * field type in the admin UI. One instance is registered per field type name
 * via {@link registerField}.
 * @template TValue The stored/submitted value type for this field.
 * @template TFilterValue The filter expression value type; defaults to `TValue`.
 */
export interface FieldComponentSet<TValue, TFilterValue = TValue> {
  Field: React.ComponentType<FieldProps<TValue>>;
  Filter: React.ComponentType<FilterProps<TFilterValue>>;
  Column: React.ComponentType<ColumnProps<TValue>>;
  defaultFilterValue: TFilterValue;
}
