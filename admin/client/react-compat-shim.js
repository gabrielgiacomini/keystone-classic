var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');

if (!React.PropTypes) {
	React.PropTypes = PropTypes;
}
if (!React.createClass) {
	React.createClass = createReactClass;
}
