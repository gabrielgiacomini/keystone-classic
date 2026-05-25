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
  geo?: [string | number | null | undefined, string | number | null | undefined];
  _improve?: boolean;
  _improve_overwrite?: boolean;
}

/** Multi-input edit widget for location (address) fields. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
  meta,
}: FieldProps<LocationValue>) {
  const val = value ?? {};
  const longitude = val.geo?.[0] ?? '';
  const latitude = val.geo?.[1] ?? '';
  const enableMapsAPI = meta.fieldType === 'location' && meta.enableMapsAPI === true;

  function update(key: keyof LocationValue, text: string) {
    onChange({ ...val, [key]: text || undefined });
  }

  function updateGeo(index: 0 | 1, text: string) {
    const geo: LocationValue['geo'] = [
      index === 0 ? text : longitude,
      index === 1 ? text : latitude,
    ];
    onChange({ ...val, geo });
  }

  function updateGoogleOption(key: '_improve' | '_improve_overwrite', checked: boolean) {
    onChange({ ...val, [key]: checked });
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
      <div>
        <label htmlFor={`${fieldName}_geo_lat`}>Latitude</label>
        <input
          id={`${fieldName}_geo_lat`}
          name={`${fieldName}[geo][1]`}
          type="text"
          value={latitude}
          onChange={(e) => updateGeo(1, e.target.value)}
          readOnly={isReadonly}
        />
      </div>
      <div>
        <label htmlFor={`${fieldName}_geo_lng`}>Longitude</label>
        <input
          id={`${fieldName}_geo_lng`}
          name={`${fieldName}[geo][0]`}
          type="text"
          value={longitude}
          onChange={(e) => updateGeo(0, e.target.value)}
          readOnly={isReadonly}
        />
      </div>
      {enableMapsAPI ? (
        <div data-field-location-google-options>
          <label>
            <input
              name={`${fieldName}_improve`}
              type="checkbox"
              checked={val._improve === true}
              onChange={(e) => updateGoogleOption('_improve', e.target.checked)}
              disabled={isReadonly}
              data-field-location-improve
            />
            Autodetect and improve location on save
          </label>
          {val._improve === true ? (
            <label>
              <input
                name={`${fieldName}_improve_overwrite`}
                type="checkbox"
                checked={val._improve_overwrite === true}
                onChange={(e) => updateGoogleOption('_improve_overwrite', e.target.checked)}
                disabled={isReadonly}
                data-field-location-overwrite
              />
              Replace existing data
            </label>
          ) : null}
        </div>
      ) : null}
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
