/**
 * @fileoverview This component renders alerts for API success and error responses.
 * It is used to display messages to the user based on the outcome of an API call.
 */
import React from 'react';
import { Alert } from '../elemental';

import { upcase } from '../../utils/string';

/**
 * Renders alerts for API success and error responses.
 *
 * @prop {object} alerts - The alerts object.
 * @prop {object} alerts.error - The error object.
 * @prop {string} alerts.error.error - The unique error type identifier.
 * @prop {object} alerts.error.detail - Optional details specific to that error type.
 * @prop {object} alerts.success - The success object.
 * @prop {string} alerts.success.success - The unique success type identifier.
 * @prop {object} alerts.success.details - Optional details specific to that success type.
 */
var AlertMessages = React.createClass({
	displayName: 'AlertMessages',
	propTypes: {
		alerts: React.PropTypes.shape({
			error: React.PropTypes.Object,
			success: React.PropTypes.Object,
		}),
	},
	getDefaultProps () {
		return {
			alerts: {},
		};
	},
	/**
	 * Renders validation errors.
	 *
	 * @returns {React.Element} The rendered validation errors.
	 */
	renderValidationErrors () {
		let errors = this.props.alerts.error.detail;
		if (errors.name === 'ValidationError') {
			errors = errors.errors;
		}
		let errorCount = Object.keys(errors).length;
		let alertContent;
		let messages = Object.keys(errors).map((path) => {
			if (errorCount > 1) {
				return (
					<li key={path}>
						{upcase(errors[path].error || errors[path].message)}
					</li>
				);
			} else {
				return (
					<div key={path}>
						{upcase(errors[path].error || errors[path].message)}
					</div>
				);
			}
		});

		if (errorCount > 1) {
			alertContent = (
				<div>
					<h4>There were {errorCount} errors creating the new item:</h4>
					<ul>{messages}</ul>
				</div>
			);
		} else {
			alertContent = messages;
		}

		return <Alert color="danger">{alertContent}</Alert>;
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		let { error, success } = this.props.alerts;

		if (error) {
			// Render error alerts
			switch (error.error) {
				case 'validation errors':
					return this.renderValidationErrors();
				case 'error':
					if (error.detail.name === 'ValidationError') {
						return this.renderValidationErrors();
					} else {
						return <Alert color="danger">{upcase(error.error)}</Alert>;
					}
				default:
					return <Alert color="danger">{upcase(error.error)}</Alert>;
			}
		}

		if (success) {
			// Render success alerts
			return <Alert color="success">{upcase(success.success)}</Alert>;
		}

		return null; // No alerts, render nothing
	},
});

module.exports = AlertMessages;
