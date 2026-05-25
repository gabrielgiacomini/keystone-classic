import React from 'react';

export default function SegmentedControl({ equalWidthSegments, onChange, options = [], value, ...props }) {
	const className = ['SegmentedControl', equalWidthSegments ? 'SegmentedControl--equal' : '', props.className]
		.filter(Boolean)
		.join(' ');
	return React.createElement('div', { ...props, className }, options.map(option => {
		const optionValue = option.value ?? option;
		const label = option.label ?? String(optionValue);
		return React.createElement('button', {
			key: optionValue,
			type: 'button',
			className: optionValue === value ? 'SegmentedControl__button is-selected' : 'SegmentedControl__button',
			onClick: () => onChange?.(optionValue),
		}, label);
	}));
}
