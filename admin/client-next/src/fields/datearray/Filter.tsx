import type { FilterProps } from '../types.js';
import { Filter as DateFilter } from '../date/Filter.js';
import type { DateFilterValue } from '../date/Filter.js';

type DateArrayFilterPresence = 'some' | 'none';

export interface DateArrayFilterValue extends DateFilterValue {
	presence?: DateArrayFilterPresence;
}

const PRESENCE_OPTIONS: Array<{ label: string; value: DateArrayFilterPresence }> = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
];

export function getDefaultDateArrayFilterValue(): DateArrayFilterValue {
	return { mode: 'on', presence: 'some', value: '' };
}

function normalizeDateArrayFilterValue(value: string | DateArrayFilterValue): DateArrayFilterValue {
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		return { ...getDefaultDateArrayFilterValue(), ...value };
	}
	return { ...getDefaultDateArrayFilterValue(), value: String(value ?? '') };
}

export function Filter({
	fieldName,
	meta,
	value,
	onChange,
}: FilterProps<string | DateArrayFilterValue>) {
	const filterValue = normalizeDateArrayFilterValue(value);
	const presence = PRESENCE_OPTIONS.some((option) => option.value === filterValue.presence)
		? filterValue.presence
		: 'some';

	function update(partial: Partial<DateArrayFilterValue>) {
		onChange({ ...filterValue, presence, ...partial });
	}

	return (
		<div data-list-filter-datearray>
			<select
				name={`${fieldName}_presence`}
				value={presence}
				onChange={(event) => update({ presence: event.target.value as DateArrayFilterPresence })}
				data-list-filter-datearray-presence
			>
				{PRESENCE_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>
			<DateFilter
				fieldName={fieldName}
				meta={meta}
				value={filterValue}
				onChange={(nextValue) => {
					if (typeof nextValue === 'object' && nextValue !== null && !Array.isArray(nextValue)) {
						onChange({ ...filterValue, ...nextValue, presence });
					} else {
						onChange({ ...filterValue, value: String(nextValue ?? ''), presence });
					}
				}}
			/>
		</div>
	);
}
