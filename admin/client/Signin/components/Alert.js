/**
 * Renders an Alert. Pass either an isInvalid and invalidMessage prop, or set
 * the signedOut prop to true to show the standard signed out message
 */

import PropTypes from 'prop-types';

import React from 'react';
import { Alert } from '../../App/elemental';

const AlertView = function (props) {
	if (props.isInvalid) {
		return <Alert key="error" color="danger" style={{ textAlign: 'center' }}>{props.invalidMessage}</Alert>;
	} else if (props.signedOut) {
		return <Alert key="signed-out" color="info" style={{ textAlign: 'center' }}>You have been signed out.</Alert>;
	} else {
		// Can't return "null" from stateless components
		return <span />;
	}
};

AlertView.propTypes = {
	invalidMessage: PropTypes.string,
	isInvalid: PropTypes.bool,
	signedOut: PropTypes.bool,
};

export default AlertView;
