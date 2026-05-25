import type { FilterProps } from '../types.js';

export interface LocationFilterValue {
  inverted?: boolean;
  street?: string;
  city?: string;
  state?: string;
  code?: string;
  country?: string;
}

export function getDefaultLocationFilterValue(): LocationFilterValue {
  return {
    inverted: false,
    street: '',
    city: '',
    state: '',
    code: '',
    country: '',
  };
}

function normalizeLocationFilterValue(value: string | LocationFilterValue): LocationFilterValue {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return { ...getDefaultLocationFilterValue(), ...value };
  }
  return { ...getDefaultLocationFilterValue(), city: String(value ?? '') };
}

/** Structured filter widget for location fields. */
export function Filter({
  fieldName,
  value,
  onChange,
}: FilterProps<string | LocationFilterValue>) {
  const filterValue = normalizeLocationFilterValue(value);

  function update(partial: Partial<LocationFilterValue>) {
    onChange({ ...filterValue, ...partial });
  }

  return (
    <div data-list-filter-location>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => update({ inverted: false })}
          data-list-filter-location-mode-match
          style={{
            flex: 1,
            padding: '0.25rem',
            fontWeight: filterValue.inverted === true ? undefined : 'bold',
          }}
        >
          Matches
        </button>
        <button
          type="button"
          onClick={() => update({ inverted: true })}
          data-list-filter-location-mode-inverted
          style={{
            flex: 1,
            padding: '0.25rem',
            fontWeight: filterValue.inverted === true ? 'bold' : undefined,
          }}
        >
          Does NOT Match
        </button>
      </div>
      <input
        name={`${fieldName}_street`}
        type="text"
        value={filterValue.street ?? ''}
        onChange={(e) => update({ street: e.target.value })}
        placeholder="Address"
        autoFocus
        data-list-filter-location-street
      />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, marginTop: 8 }}>
        <input
          name={`${fieldName}_city`}
          type="text"
          value={filterValue.city ?? ''}
          onChange={(e) => update({ city: e.target.value })}
          placeholder="City"
          data-list-filter-location-city
        />
        <input
          name={`${fieldName}_state`}
          type="text"
          value={filterValue.state ?? ''}
          onChange={(e) => update({ state: e.target.value })}
          placeholder="State"
          data-list-filter-location-state
        />
        <input
          name={`${fieldName}_code`}
          type="text"
          value={filterValue.code ?? ''}
          onChange={(e) => update({ code: e.target.value })}
          placeholder="Postcode"
          data-list-filter-location-code
        />
        <input
          name={`${fieldName}_country`}
          type="text"
          value={filterValue.country ?? ''}
          onChange={(e) => update({ country: e.target.value })}
          placeholder="Country"
          data-list-filter-location-country
        />
      </div>
    </div>
  );
}
