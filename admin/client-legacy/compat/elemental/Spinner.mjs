import React from 'react';

export default function Spinner({ ...props }) {
	const className = ['Spinner', props.className].filter(Boolean).join(' ');
	return React.createElement('span', { ...props, className, role: props.role ?? 'status' });
}
