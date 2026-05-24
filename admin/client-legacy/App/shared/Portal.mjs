/**
 * Used by the Popout component and the Lightbox component of the fields for
 * popouts. Renders a non-react DOM node.
 */

import React from 'react';
import createReactClass from 'create-react-class';
import { createPortal } from 'react-dom';

export default createReactClass({
	displayName: 'Portal',
	portalElement: null,
	componentDidMount () {
		const el = document.createElement('div');
		document.body.appendChild(el);
		this.portalElement = el;
		this.forceUpdate();
	},
	componentWillUnmount () {
		document.body.removeChild(this.portalElement);
	},
	getPortalDOMNode () {
		return this.portalElement;
	},
	render () {
		if (!this.portalElement) return null;
		return createPortal(<div {...this.props} />, this.portalElement);
	},
});
