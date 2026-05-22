import type { FieldProps } from '../types.js';

export interface GeopointValue {
  lat: number | null;
  lng: number | null;
}

/** Two number inputs (Latitude, Longitude) for geopoint fields. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<GeopointValue>) {
  const val = value ?? { lat: null, lng: null };

  function parseCoord(raw: string): number | null {
    if (raw === '') return null;
    const n = parseFloat(raw);
    return isNaN(n) ? null : n;
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div>
          <label htmlFor={`${fieldName}_lat`}>Latitude</label>
          <input
            id={`${fieldName}_lat`}
            name={`${fieldName}[lat]`}
            type="number"
            step="any"
            value={val.lat ?? ''}
            onChange={(e) => onChange({ ...val, lat: parseCoord(e.target.value) })}
            required={isRequired}
            readOnly={isReadonly}
          />
        </div>
        <div>
          <label htmlFor={`${fieldName}_lng`}>Longitude</label>
          <input
            id={`${fieldName}_lng`}
            name={`${fieldName}[lng]`}
            type="number"
            step="any"
            value={val.lng ?? ''}
            onChange={(e) => onChange({ ...val, lng: parseCoord(e.target.value) })}
            required={isRequired}
            readOnly={isReadonly}
          />
        </div>
      </div>
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
