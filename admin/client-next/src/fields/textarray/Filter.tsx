import type { FilterProps } from '../types.js';

type TextArrayFilterMode = 'contains' | 'exactly' | 'beginsWith' | 'endsWith';
type TextArrayFilterPresence = 'some' | 'none';

export interface TextArrayFilterValue {
	mode?: TextArrayFilterMode;
	presence?: TextArrayFilterPresence;
	value?: string;
}

const MODE_OPTIONS: Array<{ label: string; value: TextArrayFilterMode }> = [
	{ label: 'Contains', value: 'contains' },
	{ label: 'Exactly', value: 'exactly' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with', value: 'endsWith' },
];

const PRESENCE_OPTIONS: Array<{ label: string; value: TextArrayFilterPresence }> = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
];

export function getDefaultTextArrayFilterValue(): TextArrayFilterValue {
	return { mode: 'contains', presence: 'some', value: '' };
}

function normalizeTextArrayFilterValue(value: string | TextArrayFilterValue): TextArrayFilterValue {
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		return { ...getDefaultTextArrayFilterValue(), ...value };
	}
	return { ...getDefaultTextArrayFilterValue(), value: String(value ?? '') };
}

/** Structured text-array filter widget matching the legacy TextArray filter contract. */
export function Filter({
	fieldName,
	value,
	onChange,
}: FilterProps<string | TextArrayFilterValue>) {
	const filterValue = normalizeTextArrayFilterValue(value);
	const mode = MODE_OPTIONS.some((option) => option.value === filterValue.mode)
		? filterValue.mode
		: 'contains';
	const presence = PRESENCE_OPTIONS.some((option) => option.value === filterValue.presence)
		? filterValue.presence
		: 'some';

	function update(partial: Partial<TextArrayFilterValue>) {
		onChange({ ...filterValue, mode, presence, ...partial });
	}

	return (
		<div data-list-filter-textarray>
			<select
				name={`${fieldName}_presence`}
				value={presence}
				onChange={(event) => update({ presence: event.target.value as TextArrayFilterPresence })}
				data-list-filter-textarray-presence
			>
				{PRESENCE_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>
			<select
				name={`${fieldName}_mode`}
				value={mode}
				onChange={(event) => update({ mode: event.target.value as TextArrayFilterMode })}
				data-list-filter-textarray-mode
			>
				{MODE_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>
			<input
				aria-label={`${fieldName} filter`}
				name={`${fieldName}-filter`}
				type="text"
				value={filterValue.value ?? ''}
				onChange={(event) => update({ value: event.target.value })}
				data-list-filter-textarray-value
			/>
		</div>
	);
}
