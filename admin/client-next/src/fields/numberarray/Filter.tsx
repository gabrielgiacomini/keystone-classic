import type { FilterProps } from '../types.js';

type NumberArrayFilterMode = 'equals' | 'gt' | 'lt' | 'between';
type NumberArrayFilterPresence = 'some' | 'none';

export interface NumberArrayFilterValue {
	mode?: NumberArrayFilterMode;
	presence?: NumberArrayFilterPresence;
	value?: string | {
		min?: string;
		max?: string;
	};
}

const MODE_OPTIONS: Array<{ label: string; value: NumberArrayFilterMode }> = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' },
];

const PRESENCE_OPTIONS: Array<{ label: string; value: NumberArrayFilterPresence }> = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
];

export function getDefaultNumberArrayFilterValue(): NumberArrayFilterValue {
	return { mode: 'equals', presence: 'some', value: '' };
}

function normalizeNumberArrayFilterValue(value: string | NumberArrayFilterValue): NumberArrayFilterValue {
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		return { ...getDefaultNumberArrayFilterValue(), ...value };
	}
	return { ...getDefaultNumberArrayFilterValue(), value: String(value ?? '') };
}

/** Structured number-array filter widget matching the legacy NumberArray filter contract. */
export function Filter({
	fieldName,
	value,
	onChange,
}: FilterProps<string | NumberArrayFilterValue>) {
	const filterValue = normalizeNumberArrayFilterValue(value);
	const mode = MODE_OPTIONS.some((option) => option.value === filterValue.mode)
		? filterValue.mode
		: 'equals';
	const presence = PRESENCE_OPTIONS.some((option) => option.value === filterValue.presence)
		? filterValue.presence
		: 'some';
	const rangeValue = typeof filterValue.value === 'object' && filterValue.value !== null
		? filterValue.value
		: { min: '', max: '' };

	function update(partial: Partial<NumberArrayFilterValue>) {
		onChange({ ...filterValue, mode, presence, ...partial });
	}

	return (
		<div data-list-filter-numberarray>
			<select
				name={`${fieldName}_presence`}
				value={presence}
				onChange={(event) => update({ presence: event.target.value as NumberArrayFilterPresence })}
				data-list-filter-numberarray-presence
			>
				{PRESENCE_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>
			<select
				name={`${fieldName}_mode`}
				value={mode}
				onChange={(event) => {
					const nextMode = event.target.value as NumberArrayFilterMode;
					update({
						mode: nextMode,
						value: nextMode === 'between' ? rangeValue : '',
					});
				}}
				data-list-filter-numberarray-mode
			>
				{MODE_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>
			{mode === 'between' ? (
				<div>
					<input
						aria-label={`${fieldName} min filter`}
						name={`${fieldName}-filter-min`}
						type="number"
						inputMode="decimal"
						value={rangeValue.min ?? ''}
						onChange={(event) => update({ value: { ...rangeValue, min: event.target.value } })}
						data-list-filter-numberarray-min-value
					/>
					<input
						aria-label={`${fieldName} max filter`}
						name={`${fieldName}-filter-max`}
						type="number"
						inputMode="decimal"
						value={rangeValue.max ?? ''}
						onChange={(event) => update({ value: { ...rangeValue, max: event.target.value } })}
						data-list-filter-numberarray-max-value
					/>
				</div>
			) : (
				<input
					aria-label={`${fieldName} filter`}
					name={`${fieldName}-filter`}
					type="number"
					inputMode="decimal"
					value={typeof filterValue.value === 'string' ? filterValue.value : ''}
					onChange={(event) => update({ value: event.target.value })}
					data-list-filter-numberarray-value
				/>
			)}
		</div>
	);
}
