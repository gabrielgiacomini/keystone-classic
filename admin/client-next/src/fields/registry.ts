import { useEffect, useRef } from 'react';
import type { FieldComponentSet, FieldTypeName } from './types.js';

// ---------------------------------------------------------------------------
// NotImplemented — placeholder component used until real implementations land
// ---------------------------------------------------------------------------

function NotImplemented(): null {
  const warnedRef = useRef(false);
  useEffect(() => {
    if (!warnedRef.current) {
      warnedRef.current = true;
      console.warn(
        '[FieldRegistry] A field component has not been implemented yet. ' +
          'Rendering nothing until the real component is registered.',
      );
    }
  }, []);
  return null;
}

// ---------------------------------------------------------------------------
// stubSet — satisfies FieldComponentSet<unknown> using NotImplemented
// ---------------------------------------------------------------------------

const stubSet: FieldComponentSet<unknown, unknown> = {
  Field: NotImplemented,
  Filter: NotImplemented,
  Column: NotImplemented,
  defaultFilterValue: null,
};

// ---------------------------------------------------------------------------
// registry — exhaustive map from every FieldTypeName to a FieldComponentSet
// ---------------------------------------------------------------------------

/**
 * Exhaustive map from every {@link FieldTypeName} to a {@link FieldComponentSet}.
 * All entries start as `stubSet` and are replaced at startup when the
 * corresponding `fields/<type>/index.ts` module is imported (via side-effect).
 */
export const registry: Record<FieldTypeName, FieldComponentSet<unknown, unknown>> = {
  text: stubSet,
  textarea: stubSet,
  email: stubSet,
  url: stubSet,
  boolean: stubSet,
  number: stubSet,
  numberarray: stubSet,
  password: stubSet,
  key: stubSet,
  name: stubSet,
  code: stubSet,
  color: stubSet,
  select: stubSet,
  money: stubSet,
  date: stubSet,
  datearray: stubSet,
  datetime: stubSet,
  markdown: stubSet,
  location: stubSet,
  geopoint: stubSet,
  html: stubSet,
  localfile: stubSet,
  localfiles: stubSet,
  cloudinaryimage: stubSet,
  cloudinaryimages: stubSet,
  cloudinary: stubSet,
  relationship: stubSet,
  file: stubSet,
  textarray: stubSet,
};

// ---------------------------------------------------------------------------
// registerField — used by individual field index.ts files at startup
// ---------------------------------------------------------------------------

/**
 * Registers a field's component set in the global registry. Called once per
 * field type at startup from the field's `index.ts` module.
 * @param typeName The field type name to register under.
 * @param set The component set to associate with this field type.
 */
export function registerField(
  typeName: FieldTypeName,
  set: FieldComponentSet<unknown, unknown>,
): void {
  registry[typeName] = set;
}

/**
 * Returns field types still backed by the startup stub after field modules have
 * had a chance to register their component sets.
 */
export function getUnregisteredFieldTypes(): FieldTypeName[] {
  return (Object.keys(registry) as FieldTypeName[]).filter(
    typeName => registry[typeName] === stubSet,
  );
}

/**
 * Fails fast when the field side-effect import barrel falls out of sync with
 * the registry.
 */
export function assertAllFieldsRegistered(): void {
  const unregistered = getUnregisteredFieldTypes();
  if (unregistered.length > 0) {
    throw new Error(
      `[FieldRegistry] Missing field component registrations for: ${unregistered.join(', ')}`,
    );
  }
}

// ---------------------------------------------------------------------------
// getFieldComponents — safe lookup with fallback + warning for unknown types
// ---------------------------------------------------------------------------

/**
 * Looks up the component set for a field type by name. Falls back to stub
 * components (rendering `null` with a console warning) for unknown types.
 * @param fieldType The `fieldType` string from the server field metadata.
 * @returns The registered {@link FieldComponentSet}, or stub components.
 */
export function getFieldComponents(fieldType: string): FieldComponentSet<unknown, unknown> {
  const set = registry[fieldType as FieldTypeName];
  if (set === undefined) {
    console.warn(
      `[FieldRegistry] Unknown field type "${fieldType}". Falling back to stub components.`,
    );
    return stubSet;
  }
  return set;
}
