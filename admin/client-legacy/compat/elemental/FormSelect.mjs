import React from 'react';

export default function FormSelect({ children, options, ...props }) {
	const className = ['FormSelect', props.className].filter(Boolean).join(' ');
	const optionNodes = options
		? options.map(option => React.createElement('option', {
			key: option.value ?? option.label,
			value: option.value,
		}, option.label ?? option.value))
		: children;
	return React.createElement('select', { ...props, className }, optionNodes);
}
