import React, { Component, PropTypes } from 'react';
import Transition from 'react-addons-css-transition-group';
import { render } from 'react-dom';
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
		this.componentDidUpdate();
	}
	/**
	 * Re-renders the portal content into this.portalElement, wrapping children
	 * in a CSS fade transition group with a 200 ms enter/leave duration.
	 * @returns {void}
	 */
	componentDidUpdate () {
		// Animate fade on mount/unmount
		const duration = 200;
		const styles = `
				.fade-enter { opacity: 0.01; }
				.fade-enter.fade-enter-active { opacity: 1; transition: opacity ${duration}ms; }
				.fade-leave { opacity: 1; }
				.fade-leave.fade-leave-active { opacity: 0.01; transition: opacity ${duration}ms; }
		`;
		render(
			<PassContext context={this.context}>
				<div>
					<style>{styles}</style>
					<Transition
						component="div"
						transitionName="fade"
						transitionEnterTimeout={duration}
						transitionLeaveTimeout={duration}
						{...this.props}
					/>
				</div>
			</PassContext>,
			this.portalElement
		);
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
		return null;
	}
}

Portal.contextTypes = {
	onClose: PropTypes.func,
};
