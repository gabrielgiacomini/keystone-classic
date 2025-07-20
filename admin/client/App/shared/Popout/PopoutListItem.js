/**
 * @fileoverview This file contains the PopoutListItem component, which is used
 * to render a single item in a popout list.
 */
import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

/**
 * Renders a popout list item.
 *
 * @prop {string} icon - The name of the icon to display.
 * @prop {string} iconHover - The name of the icon to display when the item is hovered.
 * @prop {boolean} isSelected - Whether the item is selected.
 * @prop {string} label - The label for the item.
 * @prop {function} onClick - The function to call when the item is clicked.
 */
var PopoutListItem = React.createClass({
	displayName: 'PopoutListItem',
	propTypes: {
		icon: React.PropTypes.string,
		iconHover: React.PropTypes.string,
		isSelected: React.PropTypes.bool,
		label: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func,
	},
	getInitialState () {
		return {
			hover: false,
		};
	},
	/**
	 * Sets the hover state to true.
	 */
	hover () {
		this.setState({ hover: true });
	},
	/**
	 * Sets the hover state to false.
	 */
	unhover () {
		this.setState({ hover: false });
	},
	/**
	 * Renders an icon.
	 *
	 * @returns {React.Element} The rendered icon.
	 */
	renderIcon () {
		if (!this.props.icon) return null;
		const icon = this.state.hover && this.props.iconHover ? this.props.iconHover : this.props.icon;
		const iconClassname = classnames('PopoutList__item__icon octicon', ('octicon-' + icon));

		return <span className={iconClassname} />;
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const itemClassname = classnames('PopoutList__item', {
			'is-selected': this.props.isSelected,
		});
		const props = blacklist(this.props, 'className', 'icon', 'iconHover', 'isSelected', 'label');
		return (
			<button
				type="button"
				title={this.props.label}
				className={itemClassname}
				onFocus={this.hover}
				onBlur={this.unhover}
				onMouseOver={this.hover}
				onMouseOut={this.unhover}
				{...props}
			>
				{this.renderIcon()}
				<span className="PopoutList__item__label">
					{this.props.label}
				</span>
			</button>
		);
	},
});

module.exports = PopoutListItem;
