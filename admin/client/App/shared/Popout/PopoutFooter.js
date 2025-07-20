/**
 * @fileoverview This file contains the PopoutFooter component, which is used to
 * render a footer for a popout.
 */
import React from 'react';

const BUTTON_BASE_CLASSNAME = 'Popout__footer__button Popout__footer__button--';

/**
 * Renders a footer for a popout.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {function} props.primaryButtonAction The function to call when the primary button is clicked.
 * @param {boolean} props.primaryButtonIsSubmit Whether the primary button is a submit button.
 * @param {string} props.primaryButtonLabel The label for the primary button.
 * @param {function} props.secondaryButtonAction The function to call when the secondary button is clicked.
 * @param {string} props.secondaryButtonLabel The label for the secondary button.
 * @returns {React.Element} The rendered component.
 */
const PopoutFooter = React.createClass({
	displayName: 'PopoutFooter',
	propTypes: {
		children: React.PropTypes.node,
		primaryButtonAction: React.PropTypes.func,
		primaryButtonIsSubmit: React.PropTypes.bool,
		primaryButtonLabel: React.PropTypes.string,
		secondaryButtonAction: React.PropTypes.func,
		secondaryButtonLabel: React.PropTypes.string,
	},
	/**
	 * Renders a primary button.
	 *
	 * @returns {React.Element} The rendered primary button.
	 */
	renderPrimaryButton () {
		if (!this.props.primaryButtonLabel) return null;

		return (
			<button
				type={this.props.primaryButtonIsSubmit ? 'submit' : 'button'}
				className={BUTTON_BASE_CLASSNAME + 'primary'}
				onClick={this.props.primaryButtonAction}
			>
				{this.props.primaryButtonLabel}
			</button>
		);
	},
	/**
	 * Renders a secondary button.
	 *
	 * @returns {React.Element} The rendered secondary button.
	 */
	renderSecondaryButton () {
		if (!this.props.secondaryButtonAction || !this.props.secondaryButtonLabel) return null;

		return (
			<button
				type="button"
				className={BUTTON_BASE_CLASSNAME + 'secondary'}
				onClick={this.props.secondaryButtonAction}
			>
				{this.props.secondaryButtonLabel}
			</button>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<div className="Popout__footer">
				{this.renderPrimaryButton()}
				{this.renderSecondaryButton()}
				{this.props.children}
			</div>
		);
	},
});

module.exports = PopoutFooter;
