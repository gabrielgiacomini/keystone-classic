import React from 'react';
import PropTypes from 'prop-types';

const Toolbar = (props) => <div {...props} className="Toolbar" />;

Toolbar.displayName = 'Toolbar';
Toolbar.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Toolbar;
