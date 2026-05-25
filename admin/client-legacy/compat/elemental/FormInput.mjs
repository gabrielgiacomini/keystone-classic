import React from 'react';

export default function FormInput({ component: Component = 'input', multiline, type = 'text', ...props }) {
	const element = multiline ? 'textarea' : Component;
	const className = ['FormInput', props.className].filter(Boolean).join(' ');
	const elementProps = element === 'input' ? { ...props, type, className } : { ...props, className };
	return React.createElement(element, elementProps);
}
