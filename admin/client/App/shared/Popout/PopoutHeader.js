/**
 * @fileoverview This file contains the PopoutHeader component, which is used to
 * render a header for a popout.
 */
import React from 'react';
import Transition from 'react-addons-css-transition-group';

/**
 * Renders a header for a popout.
 *
 * @param {object} props The properties for the component.
 * @param {function} props.leftAction The function to call when the left action is triggered.
 * @param {string} props.leftIcon The name of the icon to display for the left action.
 * @param {string} props.title The title of the popout.
 * @param {string} props.transitionDirection The direction of the transition.
 * @returns {React.Element} The rendered component.
 */
const PopoutHeader = React.createClass({
	displayName: 'PopoutHeader',
	propTypes: {
		leftAction: React.PropTypes.func,
		leftIcon: React.PropTypes.string,
		title: React.PropTypes.string.isRequired,
		transitionDirection: React.PropTypes.oneOf(['next', 'prev']),
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		// If we have a left action and a left icon, render a header button
		var headerButton = (this.props.leftAction && this.props.leftIcon) ? (
			<button
				key={'button_' + this.props.transitionDirection}
				type="button"
				className={'Popout__header__button octicon octicon-' + this.props.leftIcon}
				onClick={this.props.leftAction}
			/>
		) : null;
		// If we have a title, render it
		var headerTitle = this.props.title ? (
			<span
				key={'title_' + this.props.transitionDirection}
				className="Popout__header__label"
			>
				{this.props.title}
			</span>
		) : null;

		return (
			<div className="Popout__header">
				<Transition
					transitionName="Popout__header__button"
					transitionEnterTimeout={200}
					transitionLeaveTimeout={200}
				>
					{headerButton}
				</Transition>
				<Transition
					transitionName={'Popout__pane-' + this.props.transitionDirection}
					transitionEnterTimeout={360}
					transitionLeaveTimeout={360}
				>
					{headerTitle}
				</Transition>
			</div>
		);
	},
});

module.exports = PopoutHeader;
