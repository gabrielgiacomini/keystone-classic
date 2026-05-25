import React from 'react';

export default function InlineGroup({ children, ...props }) {
	const className = ['InlineGroup', props.className].filter(Boolean).join(' ');
	return React.createElement('div', { ...props, className }, children);
}
