import React from 'react';

function section(name, element = 'div') {
	return function PopoutSection({ children, ...props }) {
		const className = [`Popout__${name}`, props.className].filter(Boolean).join(' ');
		return React.createElement(element, { ...props, className }, children);
	};
}

export default function Popout({ children, isOpen = true, ...props }) {
	if (!isOpen) return null;
	const className = ['Popout', props.className].filter(Boolean).join(' ');
	return React.createElement('div', { ...props, className }, children);
}

Popout.Body = section('Body');
Popout.Footer = section('Footer');
Popout.Header = section('Header');
Popout.Pane = section('Pane');

export const Body = Popout.Body;
export const Footer = Popout.Footer;
export const Header = Popout.Header;
export const Pane = Popout.Pane;
