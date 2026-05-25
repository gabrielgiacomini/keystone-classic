import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import PassContext from '../PassContext/index.mjs';

/**
 * A React component that renders its children into a detached DOM node appended
 * to document.body, with a CSS fade transition applied on mount and unmount.
 */
export default class Portal extends Component {
	/**
	 * Initialises the instance and sets portalElement to null before mounting.
	 */
	constructor () {
		super();
		this.portalElement = null;
	}
	/**
	 * Creates a new div, appends it to document.body, stores a reference in
	 * this.portalElement, and triggers the first render into that node.
	 * @returns {void}
	 */
	componentDidMount () {
		const p = document.createElement('div');
		document.body.appendChild(p);
		this.portalElement = p;
		this.forceUpdate();
	}
	/**
	 * Removes the portal's div from document.body when the component unmounts.
	 * @returns {void}
	 */
	componentWillUnmount () {
		document.body.removeChild(this.portalElement);
	}
	/**
	 * Returns null because Portal renders its content out-of-tree via a detached
	 * DOM node rather than inline in the React tree.
	 * @returns {null} Always null.
	 */
	render () {
		if (!this.portalElement) return null;
		return createPortal(
			<PassContext context={this.context}>
				<div>{this.props.children}</div>
			</PassContext>,
			this.portalElement
		);
	}
}

Portal.contextTypes = {
	onClose: PropTypes.func,
};
