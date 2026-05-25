import type { FilterProps } from '../types.js';

export interface PasswordFilterValue {
  exists: boolean;
}

/** Password existence filter widget. */
export function Filter({ fieldName, value, onChange }: FilterProps<string | PasswordFilterValue>) {
  const exists =
    typeof value === 'object' && value !== null && !Array.isArray(value)
      ? value.exists !== false
      : value === 'false'
        ? false
        : true;

  return (
    <div>
      <label>
        <input
          type="radio"
          name={`${fieldName}_exists`}
          value="true"
          checked={exists}
          onChange={() => onChange({ exists: true })}
          data-list-filter-password-exists
        />
        Is Set
      </label>
      <label>
        <input
          type="radio"
          name={`${fieldName}_exists`}
          value="false"
          checked={!exists}
          onChange={() => onChange({ exists: false })}
          data-list-filter-password-missing
        />
        Is NOT Set
      </label>
    </div>
  );
}
