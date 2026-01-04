/**
 * Renders an "Invalid Field Type" error
 */

import PropTypes from 'prop-types';

import React from 'react';

const InvalidFieldType = function (props) {
	return (
		<div className="alert alert-danger">
			Invalid field type <strong>{props.type}</strong> at path <strong>{props.path}</strong>
		</div>
	);
};

InvalidFieldType.propTypes = {
	path: PropTypes.string,
	type: PropTypes.string,
};

export default InvalidFieldType;
