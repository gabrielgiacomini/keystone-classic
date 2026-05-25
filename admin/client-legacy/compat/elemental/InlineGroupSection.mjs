import React from 'react';

export default function InlineGroupSection({ children, grow, ...props }) {
	const className = ['InlineGroup__Section', grow ? 'InlineGroup__Section--grow' : '', props.className]
		.filter(Boolean)
		.join(' ');
	return React.createElement('div', { ...props, className }, children);
}
