import React from 'react';

export default function Kbd({ children, ...props }) {
	return React.createElement('kbd', props, children);
}
