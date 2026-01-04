import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

function ToolbarSection ({ className, left, right, ...props }) {
	props.className = classNames('Toolbar__section', {
		'Toolbar__section--left': left,
		'Toolbar__section--right': right,
	}, className);

	return <div {...props} />;
}

ToolbarSection.propTypes = {
	left: PropTypes.bool,
	right: PropTypes.bool,
};

export default ToolbarSection;
