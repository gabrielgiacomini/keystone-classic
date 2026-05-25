import React from 'react';

export default function InlineGroupSection({
	active,
	children,
	contiguous,
	grow,
	position,
	style,
	...props
}) {
	void active;
	void contiguous;
	const className = ['InlineGroup__Section', grow ? 'InlineGroup__Section--grow' : '', props.className]
		.filter(Boolean)
		.join(' ');
	const separate = position === 'last' || position === 'middle';
	const sectionStyle = {
		...(grow ? { flex: '1 1 0', minWidth: 0 } : null),
		...(separate ? { paddingLeft: '0.75em' } : null),
		...style,
	};

	return React.createElement('div', { ...props, className, style: sectionStyle }, children);
}
