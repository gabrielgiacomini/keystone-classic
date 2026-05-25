import React from 'react';

export default function FormField({ children, htmlFor, label, ...props }) {
	const className = ['FormField', props.className].filter(Boolean).join(' ');
	return React.createElement('div', { ...props, className }, [
		label ? React.createElement('label', { key: 'label', htmlFor, className: 'FormLabel' }, label) : null,
		children,
	]);
}
