import React, { Children, cloneElement, isValidElement } from 'react';

export default function InlineGroup({
	block,
	children,
	className,
	contiguous,
	style,
	...props
}) {
	const items = Children.toArray(children).filter(Boolean);
	const lastIndex = items.length - 1;
	const styledChildren = items.map((child, index) => {
		if (!isValidElement(child)) return child;

		let position = 'only';
		if (lastIndex > 0) {
			if (index === 0) position = 'first';
			else if (index === lastIndex) position = 'last';
			else position = 'middle';
		}

		return cloneElement(child, {
			contiguous,
			position,
		});
	});
	const groupClassName = [
		'InlineGroup',
		block ? 'InlineGroup--block' : null,
		className,
	].filter(Boolean).join(' ');
	const groupStyle = {
		display: block ? 'flex' : 'inline-flex',
		alignItems: 'stretch',
		...style,
	};

	return React.createElement('div', { ...props, className: groupClassName, style: groupStyle }, styledChildren);
}
