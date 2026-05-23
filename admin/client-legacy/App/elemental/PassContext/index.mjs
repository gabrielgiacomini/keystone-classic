import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';

// Pass the Lightbox context through to the Portal's descendents
// StackOverflow discussion http://goo.gl/oclrJ9

/**
 * React component that passes a supplied context object down to Portal descendants.
 *
 * Wraps a single child element and exposes the context provided via `props.context`
 * as React child context, enabling descendant components inside a Portal to access
 * context that would otherwise be severed by the Portal boundary.
 */
class PassContext extends Component {
	/**
	 * Returns the child context object to be made available to descendant components.
	 * @returns {object} The context object passed in via `props.context`.
	 */
	getChildContext () {
		return this.props.context;
	}
	/**
	 * Renders the single child element passed to this component.
	 * @returns {React.Element} The sole child element from `props.children`.
	 */
	render () {
		return Children.only(this.props.children);
	}
};

PassContext.propTypes = {
	context: PropTypes.object.isRequired,
};
PassContext.childContextTypes = {
	onClose: PropTypes.func,
};

export default PassContext;
