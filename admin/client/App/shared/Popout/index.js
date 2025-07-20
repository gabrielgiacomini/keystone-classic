/**
 * @fileoverview This file contains the Popout component, which is used to
 * render a popout. It can also use a Header (Popout/Header), a Footer
 * (Popout/Footer), a Body (Popout/Body) and a Pan (Popout/Pane).
 */
import React from 'react';
import Portal from '../Portal';
import Transition from 'react-addons-css-transition-group';

/**
 * The sizes for the popout.
 * @type {{arrowHeight: number, arrowWidth: number, horizontalMargin: number}}
 */
const SIZES = {
	arrowHeight: 12,
	arrowWidth: 16,
	horizontalMargin: 20,
};

/**
 * Renders a popout.
 *
 * @prop {boolean} isOpen - Whether the popout is open.
 * @prop {function} onCancel - The function to call when the popout is cancelled.
 * @prop {function} onSubmit - The function to call when the popout is submitted.
 * @prop {string} relativeToID - The ID of the element to which the popout is relative.
 * @prop {number} width - The width of the popout.
 */
var Popout = React.createClass({
	displayName: 'Popout',
	propTypes: {
		isOpen: React.PropTypes.bool,
		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func,
		relativeToID: React.PropTypes.string.isRequired,
		width: React.PropTypes.number,
	},
	getDefaultProps () {
		return {
			width: 320,
		};
	},
	getInitialState () {
		return {};
	},
	componentWillReceiveProps (nextProps) {
		if (!this.props.isOpen && nextProps.isOpen) {
			window.addEventListener('resize', this.calculatePosition);
			this.calculatePosition(nextProps.isOpen);
		} else if (this.props.isOpen && !nextProps.isOpen) {
			window.removeEventListener('resize', this.calculatePosition);
		}
	},
	/**
	 * Gets the DOM node of the portal.
	 *
	 * @returns {DOMNode} The DOM node of the portal.
	 */
	getPortalDOMNode () {
		return this.refs.portal.getPortalDOMNode();
	},
	/**
	 * Calculates the position of the popout.
	 *
	 * @param {boolean} isOpen - Whether the popout is open.
	 */
	calculatePosition (isOpen) {
		if (!isOpen) return;
		let posNode = document.getElementById(this.props.relativeToID);

		const pos = {
			top: 0,
			left: 0,
			width: posNode.offsetWidth,
			height: posNode.offsetHeight,
		};
		while (posNode.offsetParent) {
			pos.top += posNode.offsetTop;
			pos.left += posNode.offsetLeft;
			posNode = posNode.offsetParent;
		}

		let leftOffset = Math.max(pos.left + (pos.width / 2) - (this.props.width / 2), SIZES.horizontalMargin);
		let topOffset = pos.top + pos.height + SIZES.arrowHeight;

		var spaceOnRight = window.innerWidth - (leftOffset + this.props.width + SIZES.horizontalMargin);
		if (spaceOnRight < 0) {
			leftOffset = leftOffset + spaceOnRight;
		}

		const arrowLeftOffset = leftOffset === SIZES.horizontalMargin
			? pos.left + (pos.width / 2) - (SIZES.arrowWidth / 2) - SIZES.horizontalMargin
			: null;

		const newStateAvaliable = this.state.leftOffset !== leftOffset
			|| this.state.topOffset !== topOffset
			|| this.state.arrowLeftOffset !== arrowLeftOffset;

		if (newStateAvaliable) {
			this.setState({
				leftOffset: leftOffset,
				topOffset: topOffset,
				arrowLeftOffset: arrowLeftOffset,
			});
		}
	},
	/**
	 * Renders the popout.
	 *
	 * @returns {React.Element} The rendered popout.
	 */
	renderPopout () {
		if (!this.props.isOpen) return null;

		const { width } = this.props;
		const { arrowLeftOffset, leftOffset: left, topOffset: top } = this.state;

		const arrowStyles = arrowLeftOffset
			? { left: 0, marginLeft: arrowLeftOffset }
			: null;

		return (
			<div className="Popout" style={{ left, top, width }}>
				<span className="Popout__arrow" style={arrowStyles} />
				<div className="Popout__inner">
					{this.props.children}
				</div>
			</div>
		);
	},
	/**
	 * Renders the blockout.
	 *
	 * @returns {React.Element} The rendered blockout.
	 */
	renderBlockout () {
		if (!this.props.isOpen) return;
		return <div className="blockout" onClick={this.props.onCancel} />;
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<Portal className="Popout-wrapper" ref="portal">
				<Transition
					transitionEnterTimeout={200}
					transitionLeaveTimeout={200}
					transitionName="Popout"
				>
					{this.renderPopout()}
				</Transition>
				{this.renderBlockout()}
			</Portal>
		);
	},
});

module.exports = Popout;

// expose the child to the top level export
module.exports.Header = require('./PopoutHeader');
module.exports.Body = require('./PopoutBody');
module.exports.Footer = require('./PopoutFooter');
module.exports.Pane = require('./PopoutPane');
