import React from 'react';

export default function FormNote({ children, ...props }) {
	const className = ['FormNote', props.className].filter(Boolean).join(' ');
	return React.createElement('div', { ...props, className }, children);
}
