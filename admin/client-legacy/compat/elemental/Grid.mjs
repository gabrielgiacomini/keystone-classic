import React from 'react';

export function Row({ children, ...props }) {
	const className = ['GridRow', props.className].filter(Boolean).join(' ');
	return React.createElement('div', { ...props, className }, children);
}

export function Col({ children, width, ...props }) {
	const className = ['GridCol', width ? `GridCol--${width}` : '', props.className].filter(Boolean).join(' ');
	return React.createElement('div', { ...props, className }, children);
}

export default { Row, Col };
