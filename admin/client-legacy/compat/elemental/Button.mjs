import React from 'react';

export default function Button({ children, component: Component = 'button', cssStyles, variant, ...props }) {
	void cssStyles;
	const className = ['Button', variant ? `Button--${variant}` : '', props.className].filter(Boolean).join(' ');
	const buttonProps = Component === 'button' && props.type === undefined ? { type: 'button' } : {};
	return React.createElement(Component, { ...buttonProps, ...props, className }, children);
}
