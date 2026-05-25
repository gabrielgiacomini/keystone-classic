import React from 'react';

export default function Select({ children, onChange, options = [], value, ...props }) {
	const className = ['Select', props.className].filter(Boolean).join(' ');
	const optionNodes = options.map(option => {
		const optionValue = option.value ?? option;
		return React.createElement('option', {
			key: optionValue,
			value: optionValue,
		}, option.label ?? String(optionValue));
	});
	return React.createElement('select', {
		...props,
		className,
		value,
		onChange: event => onChange?.(event.target.value),
	}, children ?? optionNodes);
}

Select.Async = function AsyncSelect({ loadOptions, multi, onChange, value, valueKey = 'value', labelKey = 'label', ...props }) {
	const [options, setOptions] = React.useState([]);
	const [input, setInput] = React.useState('');

	React.useEffect(() => {
		let isMounted = true;
		loadOptions?.(input, (_error, result) => {
			if (!isMounted) return;
			const nextOptions = Array.isArray(result) ? result : result?.options ?? [];
			setOptions(nextOptions);
		});
		return () => {
			isMounted = false;
		};
	}, [input, loadOptions]);

	const selectedValues = Array.isArray(value)
		? value.map(item => String(typeof item === 'object' ? item[valueKey] : item))
		: value == null ? [] : [String(typeof value === 'object' ? value[valueKey] : value)];

	return React.createElement('select', {
		...props,
		multiple: multi,
		value: multi ? selectedValues : selectedValues[0] ?? '',
		onChange: event => {
			const selected = Array.from(event.target.selectedOptions).map(option => option.value);
			onChange?.(multi ? selected : selected[0] ?? null);
		},
		onInput: event => setInput(event.target.value),
	}, [
		!multi ? React.createElement('option', { key: '', value: '' }, '') : null,
		...options.map(option => {
			const optionValue = option[valueKey] ?? option.value ?? option;
			const optionLabel = option[labelKey] ?? option.label ?? String(optionValue);
			return React.createElement('option', { key: optionValue, value: optionValue }, optionLabel);
		}),
	]);
};
