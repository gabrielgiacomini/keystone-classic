import React from 'react';

export default function FormLabel({ children, ...props }) {
	const className = ['FormLabel', props.className].filter(Boolean).join(' ');
	return React.createElement('label', { ...props, className }, children);
}
