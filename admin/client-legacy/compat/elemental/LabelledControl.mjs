import React from 'react';

export default function LabelledControl({ children, label, ...props }) {
	const className = ['LabelledControl', props.className].filter(Boolean).join(' ');
	return React.createElement('label', { ...props, className }, [
		children,
		label ? React.createElement('span', { key: 'label' }, label) : null,
	]);
}
