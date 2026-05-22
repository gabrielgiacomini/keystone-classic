import React, { Component, PropTypes } from 'react';
/**
 * Renders alternate content when a modifier key (e.g. Alt) is held down
 */
class AltText extends Component {
	/**
	 * Initialises key-tracking handlers and sets the initial modified state
	 */
	constructor () {
		super();

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);

		this.state = {
			modified: false,
		};
	}
	/**
	 * Attaches keydown and keyup listeners to detect modifier key presses
	 */
	componentDidMount () {
		document.body.addEventListener('keydown', this.handleKeyDown, false);
		document.body.addEventListener('keyup', this.handleKeyUp, false);
	}
	/**
	 * Removes keydown and keyup listeners on unmount
	 */
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	}
	/**
	 * Sets modified state when the configured modifier key is pressed
	 * @param {KeyboardEvent} e The keydown event
	 */
	handleKeyDown (e) {
		if (e.key !== this.props.modifier) return;
		this.setState({
			modified: true,
		});
	}
	/**
	 * Clears modified state when the configured modifier key is released
	 * @param {KeyboardEvent} e The keyup event
	 */
	handleKeyUp (e) {
		if (e.key !== this.props.modifier) return;
		this.setState({
			modified: false,
		});
	}
	/**
	 * Renders the wrapped component with either normal or modified children based on key state
	 * @returns {React.Element} The rendered component
	 */
	render () {
		// NOTE `modifier` is declared to remove it from `props`, though never used
		const {
			component: Component,
			modified,
			modifier,  
			normal,
			...props
		} = this.props;

		props.children = this.state.modified
			? modified
			: normal;

		return <Component {...props} />;
	}
};

const SUPPORTED_KEYS = [
	'Alt',
	'Control',
	'Meta',
	'Shift',
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
	modifier: 'Alt',
};

export default AltText;
