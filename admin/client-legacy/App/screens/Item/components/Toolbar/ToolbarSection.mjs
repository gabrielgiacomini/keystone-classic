import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Renders a toolbar section div with optional left or right alignment modifier classes
 * @param {object} props Component props
 * @param {string} [props.className] Additional CSS class name
 * @param {boolean} [props.left] When true, applies the left-alignment modifier class
 * @param {boolean} [props.right] When true, applies the right-alignment modifier class
 * @returns {React.Element} A div element with appropriate Toolbar__section class names
 */
function ToolbarSection ({ className, left, right, ...props }) {
	props.className = classNames('Toolbar__section', {
		'Toolbar__section--left': left,
		'Toolbar__section--right': right,
	}, className);

	return <div {...props} />;
};

ToolbarSection.propTypes = {
	left: PropTypes.bool,
	right: PropTypes.bool,
};

export default ToolbarSection;
