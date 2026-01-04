import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

if (!React.PropTypes) {
	React.PropTypes = PropTypes;
}
if (!React.createClass) {
	React.createClass = createReactClass;
}
