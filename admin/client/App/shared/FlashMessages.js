/**
 * @fileoverview This component renders flash messages, such as errors, success
 * messages, warnings, etc.
 */
import React from 'react';
import _ from 'lodash';

import FlashMessage from './FlashMessage';

/**
 * Renders a list of flash messages.
 *
 * @prop {object|boolean} messages - The messages to render. If false, nothing is rendered.
 * @prop {array} messages.error - An array of error messages.
 * @prop {array} messages.hilight - An array of highlight messages.
 * @prop {array} messages.info - An array of info messages.
 * @prop {array} messages.success - An array of success messages.
 * @prop {array} messages.warning - An array of warning messages.
 */
var FlashMessages = React.createClass({
	displayName: 'FlashMessages',
	propTypes: {
		messages: React.PropTypes.oneOfType([
			React.PropTypes.bool,
			React.PropTypes.shape({
				error: React.PropTypes.array,
				hilight: React.PropTypes.array,
				info: React.PropTypes.array,
				success: React.PropTypes.array,
				warning: React.PropTypes.array,
			}),
		]),
	},
	/**
	 * Renders a list of messages for a given type.
	 *
	 * @param {array} messages - The messages to render.
	 * @param {string} type - The type of message.
	 * @returns {React.Element[]} The rendered messages.
	 */
	renderMessages (messages, type) {
		if (!messages || !messages.length) return null;

		return messages.map((message, i) => {
			return <FlashMessage message={message} type={type} key={`i${i}`} />;
		});
	},
	/**
	 * Renders the messages for each type.
	 *
	 * @param {object} types - The messages to render, grouped by type.
	 * @returns {React.Element[]} The rendered messages.
	 */
	renderTypes (types) {
		return Object.keys(types).map(type => this.renderMessages(types[type], type));
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		if (!this.props.messages) return null;

		return (
			<div className="flash-messages">
				{_.isPlainObject(this.props.messages) && this.renderTypes(this.props.messages)}
			</div>
		);
	},
});

module.exports = FlashMessages;
