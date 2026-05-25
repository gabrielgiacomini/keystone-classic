import React from 'react';

export default function Form({ children, component: Component = 'form', type, ...props }) {
	const className = ['Form', type ? `Form--${type}` : '', props.className].filter(Boolean).join(' ');
	return React.createElement(Component, { ...props, className }, children);
}
