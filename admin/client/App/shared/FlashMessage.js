/**
 * @fileoverview This file contains the FlashMessage component, which is used to
 * render a single flash message. It is used by the FlashMessages component.
 */
import React, { PropTypes } from 'react';
import { Alert } from '../elemental';

/**
 * Renders a single flash message.
 *
 * @param {object} props The properties for the component.
 * @param {object|string} props.message The message to render.
 * @param {string} props.type The type of message.
 * @returns {React.Element} The rendered component.
 */
const FlashMessage = React.createClass({
	propTypes: {
		message: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string,
		]).isRequired,
		type: PropTypes.string,
	},
	/**
	 * Renders the message.
	 *
	 * @param {object|string} message The message to render.
	 * @returns {React.Element} The rendered message.
	 */
	renderMessage (message) {
		// If the message is only a string, render the string
		if (typeof message === 'string') {
			return (
				<span>
					{message}
				</span>
			);
		}

		// Get the title and the detail of the message
		const title = message.title ? <h4>{message.title}</h4> : null;
		const detail = message.detail ? <p>{message.detail}</p> : null;
		// If the message has a list attached, render a <ul>
		const list = message.list ? (
			<ul style={{ marginBottom: 0 }}>
				{message.list.map((item, i) => <li key={`i${i}`}>{item}</li>)}
			</ul>
		) : null;

		return (
			<span>
				{title}
				{detail}
				{list}
			</span>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { message, type } = this.props;

		return (
			<Alert color={type}>
				{this.renderMessage(message)}
			</Alert>
		);
	},
});

module.exports = FlashMessage;
