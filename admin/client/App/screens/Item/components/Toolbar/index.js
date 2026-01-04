import PropTypes from 'prop-types';
import React from 'react';

const Toolbar = (props) => <div {...props} className="Toolbar" />;

Toolbar.displayName = 'Toolbar';
Toolbar.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Toolbar;
