/**
 * @fileoverview This file contains the Portal component, which is used to render
 * a non-react DOM node. It is used by the Popout component and the Lightbox
 * component of the fields for popouts.
 */
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Renders a non-react DOM node.
 */
module.exports = React.createClass({
	displayName: 'Portal',
	portalElement: null, // eslint-disable-line react/sort-comp
	componentDidMount () {
		const el = document.createElement('div');
		document.body.appendChild(el);
		this.portalElement = el;
		this.componentDidUpdate();
	},
	componentWillUnmount () {
		document.body.removeChild(this.portalElement);
	},
	componentDidUpdate () {
		ReactDOM.render(<div {...this.props} />, this.portalElement);
	},
	/**
	 * Gets the DOM node of the portal.
	 *
	 * @returns {DOMNode} The DOM node of the portal.
	 */
	getPortalDOMNode () {
		return this.portalElement;
	},
	/**
	 * Renders the component.
	 *
	 * @returns {null} This component does not render anything.
	 */
	render () {
		return null;
	},
});
