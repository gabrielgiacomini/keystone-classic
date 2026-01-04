/**
 * Used by the Popout component and the Lightbox component of the fields for
 * popouts. Renders a non-react DOM node.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

export default class extends React.Component {
    static displayName = 'Portal';
    portalElement = null; // eslint-disable-line react/sort-comp
    root = null;

    componentDidMount() {
		const el = document.createElement('div');
		document.body.appendChild(el);
		this.portalElement = el;
		this.root = createRoot(el);
		this.componentDidUpdate();
	}

    componentWillUnmount() {
		if (this.root) {
			this.root.unmount();
		}
		document.body.removeChild(this.portalElement);
	}

    componentDidUpdate() {
		if (this.root) {
			this.root.render(<div {...this.props} />);
		}
	}

    getPortalDOMNode = () => {
		return this.portalElement;
	};

    render() {
		return null;
	}
}
