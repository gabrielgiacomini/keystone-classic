import React from 'react';

export default function FormInput({
	children,
	component: Component,
	multiline,
	noedit,
	type = 'text',
	...props
}) {
	const element = noedit
		? Component || 'span'
		: multiline
			? 'textarea'
			: Component || 'input';
	const className = [
		'FormInput',
		noedit ? 'FormInput-noedit' : null,
		props.className,
	].filter(Boolean).join(' ');
	const elementProps = { ...props, className };

	if (element === 'input') {
		return React.createElement(element, { ...elementProps, type });
	}
	return React.createElement(element, elementProps, children);
}
