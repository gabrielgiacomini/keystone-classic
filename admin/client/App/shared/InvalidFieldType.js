/**
 * @fileoverview This file contains the InvalidFieldType component, which is
 * used to render an "Invalid Field Type" error.
 */
import React from 'react';

/**
 * Renders an "Invalid Field Type" error.
 *
 * @param {object} props The properties for the component.
 * @param {string} props.path The path of the invalid field.
 * @param {string} props.type The type of the invalid field.
 * @returns {React.Element} The rendered component.
 */
const InvalidFieldType = function (props) {
	return (
		<div className="alert alert-danger">
			Invalid field type <strong>{props.type}</strong> at path <strong>{props.path}</strong>
		</div>
	);
};

InvalidFieldType.propTypes = {
	path: React.PropTypes.string,
	type: React.PropTypes.string,
};

module.exports = InvalidFieldType;
