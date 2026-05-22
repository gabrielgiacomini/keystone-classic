import type { FilterProps } from '../types.js';

export interface GeopointFilterValue {
  lat: string;
  lon: string;
  distance: {
    mode: 'max' | 'min';
    value: string;
  };
}

export function getDefaultGeopointFilterValue(): GeopointFilterValue {
  return {
    lat: '',
    lon: '',
    distance: { mode: 'max', value: '' },
  };
}

/**
 * Geospatial proximity filter for geopoint fields.
 *
 * Produces a value shaped as: { lat, lon, distance: { mode: 'max'|'min', value } }
 * which the server's GeoPointType.addFilterToQuery() converts to a MongoDB $near query.
 * Distance value is in kilometres; the server multiplies by 1000 to get metres.
 */
export function Filter({
  fieldName,
  value,
  onChange,
}: FilterProps<GeopointFilterValue | null | string>) {
  const val: GeopointFilterValue =
    value !== null && value !== undefined && value !== ''
      ? (value as GeopointFilterValue)
      : getDefaultGeopointFilterValue();

  function updateField(partial: Partial<GeopointFilterValue>) {
    onChange({ ...val, ...partial });
  }

  function setMode(mode: 'max' | 'min') {
    updateField({ distance: { ...val.distance, mode } });
  }

  const distancePlaceholder =
    val.distance.mode === 'max' ? 'Maximum distance (km)' : 'Minimum distance (km)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <label
            htmlFor={`${fieldName}_filter_lat`}
            style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}
          >
            Latitude
          </label>
          <input
            id={`${fieldName}_filter_lat`}
            type="number"
            step="any"
            placeholder="Latitude"
            value={val.lat}
            onChange={(e) => updateField({ lat: e.target.value })}
            autoFocus
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            htmlFor={`${fieldName}_filter_lon`}
            style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}
          >
            Longitude
          </label>
          <input
            id={`${fieldName}_filter_lon`}
            type="number"
            step="any"
            placeholder="Longitude"
            value={val.lon}
            onChange={(e) => updateField({ lon: e.target.value })}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        <button
          type="button"
          onClick={() => setMode('max')}
          style={{
            flex: 1,
            padding: '0.25rem',
            fontWeight: val.distance.mode === 'max' ? 'bold' : 'normal',
            border: val.distance.mode === 'max' ? '2px solid #1070CA' : '1px solid #ccc',
            background: val.distance.mode === 'max' ? '#e8f0fe' : '#fff',
            cursor: 'pointer',
            borderRadius: '3px',
          }}
        >
          Max distance
        </button>
        <button
          type="button"
          onClick={() => setMode('min')}
          style={{
            flex: 1,
            padding: '0.25rem',
            fontWeight: val.distance.mode === 'min' ? 'bold' : 'normal',
            border: val.distance.mode === 'min' ? '2px solid #1070CA' : '1px solid #ccc',
            background: val.distance.mode === 'min' ? '#e8f0fe' : '#fff',
            cursor: 'pointer',
            borderRadius: '3px',
          }}
        >
          Min distance
        </button>
      </div>
      <input
        type="number"
        step="any"
        min="0"
        placeholder={distancePlaceholder}
        value={val.distance.value}
        onChange={(e) =>
          updateField({ distance: { ...val.distance, value: e.target.value } })
        }
        style={{ width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
}
