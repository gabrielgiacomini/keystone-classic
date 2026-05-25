/**
 * Render a popout list item
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import classnames from 'classnames';

const PopoutListItem = createReactClass({
	displayName: 'PopoutListItem',
	propTypes: {
		icon: PropTypes.string,
		iconHover: PropTypes.string,
		isSelected: PropTypes.bool,
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func,
	},
	getInitialState () {
		return {
			hover: false,
		};
	},
	hover () {
		this.setState({ hover: true });
	},
	unhover () {
		this.setState({ hover: false });
	},
	// Render an icon
	renderIcon () {
		if (!this.props.icon) return null;
		const icon = this.state.hover && this.props.iconHover ? this.props.iconHover : this.props.icon;
		const iconClassname = classnames('PopoutList__item__icon octicon', ('octicon-' + icon));

		return <span className={iconClassname} />;
	},
	render () {
		const itemClassname = classnames('PopoutList__item', {
			'is-selected': this.props.isSelected,
		});
		const { className: _cn, icon: _i, iconHover: _ih, isSelected: _is, label: _l, ...props } = this.props;
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

export default PopoutListItem;
