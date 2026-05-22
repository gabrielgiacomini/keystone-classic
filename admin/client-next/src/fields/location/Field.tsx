import type { FieldProps } from '../types.js';

export interface LocationValue {
  number?: string;
  name?: string;
  street1?: string;
  street2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

/** Multi-input edit widget for location (address) fields. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<LocationValue>) {
  const val = value ?? {};

  function update(key: keyof LocationValue, text: string) {
    onChange({ ...val, [key]: text || undefined });
  }

  return (
    <div>
      <div>
        <label htmlFor={`${fieldName}_number`}>Number</label>
        <input
          id={`${fieldName}_number`}
          name={`${fieldName}[number]`}
          type="text"
          value={val.number ?? ''}
          onChange={(e) => update('number', e.target.value)}
          required={isRequired}
          readOnly={isReadonly}
        />
      </div>
      <div>
        <label htmlFor={`${fieldName}_name`}>Name</label>
        <input
          id={`${fieldName}_name`}
          name={`${fieldName}[name]`}
          type="text"
          value={val.name ?? ''}
          onChange={(e) => update('name', e.target.value)}
          required={isRequired}
          readOnly={isReadonly}
        />
      </div>
      <div>
        <label htmlFor={`${fieldName}_street1`}>Street 1</label>
        <input
          id={`${fieldName}_street1`}
          name={`${fieldName}[street1]`}
          type="text"
          value={val.street1 ?? ''}
          onChange={(e) => update('street1', e.target.value)}
          required={isRequired}
          readOnly={isReadonly}
        />
      </div>
      <div>
        <label htmlFor={`${fieldName}_street2`}>Street 2</label>
        <input
          id={`${fieldName}_street2`}
          name={`${fieldName}[street2]`}
          type="text"
          value={val.street2 ?? ''}
          onChange={(e) => update('street2', e.target.value)}
          readOnly={isReadonly}
        />
      </div>
      <div>
        <label htmlFor={`${fieldName}_suburb`}>Suburb</label>
        <input
          id={`${fieldName}_suburb`}
          name={`${fieldName}[suburb]`}
          type="text"
          value={val.suburb ?? ''}
          onChange={(e) => update('suburb', e.target.value)}
          readOnly={isReadonly}
        />
      </div>
      <div>
        <label htmlFor={`${fieldName}_state`}>State</label>
        <input
          id={`${fieldName}_state`}
          name={`${fieldName}[state]`}
          type="text"
          value={val.state ?? ''}
          onChange={(e) => update('state', e.target.value)}
          readOnly={isReadonly}
        />
      </div>
      <div>
        <label htmlFor={`${fieldName}_postcode`}>Postcode</label>
        <input
          id={`${fieldName}_postcode`}
          name={`${fieldName}[postcode]`}
          type="text"
          value={val.postcode ?? ''}
          onChange={(e) => update('postcode', e.target.value)}
          readOnly={isReadonly}
        />
      </div>
      <div>
        <label htmlFor={`${fieldName}_country`}>Country</label>
        <input
          id={`${fieldName}_country`}
          name={`${fieldName}[country]`}
          type="text"
          value={val.country ?? ''}
          onChange={(e) => update('country', e.target.value)}
          readOnly={isReadonly}
        />
      </div>
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
