/**
 * @fileoverview This file contains the ListControl component, which is used to
 * render a control in the list view.
 */
import React from 'react';
import classnames from 'classnames';

/**
 * Renders a control in the list view.
 *
 * @param {object} props The properties for the component.
 * @param {function} props.dragSource The drag source for the control.
 * @param {function} props.onClick The function to call when the control is clicked.
 * @param {string} props.type The type of control.
 * @returns {React.Element} The rendered component.
 */
var ListControl = React.createClass({
	propTypes: {
		dragSource: React.PropTypes.func,
		onClick: React.PropTypes.func,
		type: React.PropTypes.oneOf(['check', 'delete', 'sortable']).isRequired,
	},
	/**
	 * Renders the control.
	 *
	 * @returns {React.Element} The rendered control.
	 */
	renderControl () {
		var icon = 'octicon octicon-';
		var className = classnames('ItemList__control ItemList__control--' + this.props.type, {
			'is-active': this.props.active,
		});
		var tabindex = this.props.type === 'sortable' ? -1 : null;

		if (this.props.type === 'check') {
			icon += 'check';
		}
		if (this.props.type === 'delete') {
			icon += 'trashcan';
		}
		if (this.props.type === 'sortable') {
			icon += 'three-bars';
		}

		var renderButton = (
			<button type="button" onClick={this.props.onClick} className={className} tabIndex={tabindex}>
				<span className={icon} />
			</button>
		);
		if (this.props.dragSource) {
			return this.props.dragSource(renderButton);
		} else {
			return renderButton;
		}
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		var className = 'ItemList__col--control ItemList__col--' + this.props.type;

		return (
			<td className={className}>
				{this.renderControl()}
			</td>
		);
	},
});

module.exports = ListControl;
