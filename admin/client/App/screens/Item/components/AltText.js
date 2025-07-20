/**
 * @fileoverview This file contains the AltText component, which is used to
 * render different text when a modifier key is held down.
 */
import React, { Component, PropTypes } from 'react';
import vkey from 'vkey';

/**
 * Renders different text when a modifier key is held down.
 *
 * @param {object} props The properties for the component.
 * @param {function|string} props.component The component to render.
 * @param {React.Element|string} props.modified The text to render when the modifier key is held down.
 * @param {string} props.modifier The modifier key to listen for.
 * @param {React.Element|string} props.normal The text to render normally.
 * @returns {React.Element} The rendered component.
 */
class AltText extends Component {
	constructor () {
		super();

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);

		this.state = {
			modified: false,
		};
	}
	componentDidMount () {
		document.body.addEventListener('keydown', this.handleKeyDown, false);
		document.body.addEventListener('keyup', this.handleKeyUp, false);
	}
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	}
	/**
	 * Handles a key down event.
	 *
	 * @param {Event} e The event object.
	 */
	handleKeyDown (e) {
		if (vkey[e.keyCode] !== this.props.modifier) return;
		this.setState({
			modified: true,
		});
	}
	/**
	 * Handles a key up event.
	 *
	 * @param {Event} e The event object.
	 */
	handleKeyUp (e) {
		if (vkey[e.keyCode] !== this.props.modifier) return;
		this.setState({
			modified: false,
		});
	}
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		// NOTE `modifier` is declared to remove it from `props`, though never used
		const {
			component: Component,
			modified,
			modifier, // eslint-disable-line no-unused-vars
			normal,
			...props
		} = this.props;

		props.children = this.state.modified
			? modified
			: normal;

		return <Component {...props} />;
	}
};

/**
 * The supported modifier keys.
 * @type {string[]}
 */
const SUPPORTED_KEYS = [
	'<alt>',
	'<control>',
	'<meta>',
	'<shift>',
];

AltText.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	modified: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]),
	modifier: PropTypes.oneOf(SUPPORTED_KEYS),
	normal: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]),
};
AltText.defaultProps = {
	component: 'span',
	modifier: '<alt>',
};

module.exports = AltText;
