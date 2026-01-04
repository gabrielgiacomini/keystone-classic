/**
 * Render a header for a popout
 */

import PropTypes from 'prop-types';

import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class PopoutHeader extends React.Component {
    static displayName = 'PopoutHeader';

    static propTypes = {
		leftAction: PropTypes.func,
		leftIcon: PropTypes.string,
		title: PropTypes.string.isRequired,
		transitionDirection: PropTypes.oneOf(['next', 'prev']),
	};

    render() {
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
				<TransitionGroup>
					{headerButton && (
						<CSSTransition
							key={'button_' + this.props.transitionDirection}
							classNames="Popout__header__button"
							timeout={200}
						>
							{headerButton}
						</CSSTransition>
					)}
				</TransitionGroup>
				<TransitionGroup>
					{headerTitle && (
						<CSSTransition
							key={'title_' + this.props.transitionDirection}
							classNames={'Popout__pane-' + this.props.transitionDirection}
							timeout={360}
						>
							{headerTitle}
						</CSSTransition>
					)}
				</TransitionGroup>
			</div>
		);
	}
}

export default PopoutHeader;
