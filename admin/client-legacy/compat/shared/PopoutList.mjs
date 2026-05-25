import React from 'react';

export default function PopoutList({ children, ...props }) {
	const className = ['PopoutList', props.className].filter(Boolean).join(' ');
	return React.createElement('ul', { ...props, className }, children);
}

PopoutList.Heading = function PopoutListHeading({ children, ...props }) {
	const className = ['PopoutList__Heading', props.className].filter(Boolean).join(' ');
	return React.createElement('li', { ...props, className }, children);
};

PopoutList.Item = function PopoutListItem({ children, ...props }) {
	const className = ['PopoutList__Item', props.className].filter(Boolean).join(' ');
	return React.createElement('li', { ...props, className }, children);
};

export const Heading = PopoutList.Heading;
export const Item = PopoutList.Item;
