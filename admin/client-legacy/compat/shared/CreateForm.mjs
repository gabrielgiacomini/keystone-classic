import React from 'react';

export default function CreateForm({ children, component: Component = 'form', isOpen = true, ...props }) {
	if (!isOpen) return null;
	const className = ['CreateForm', props.className].filter(Boolean).join(' ');
	return React.createElement(Component, { ...props, className }, children);
}
