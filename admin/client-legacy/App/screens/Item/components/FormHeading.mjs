import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import evalDependsOn from '../../../../../../fields/utils/evalDependsOn.mjs';

export default createReactClass({
	displayName: 'FormHeading',
	propTypes: {
		options: PropTypes.object,
	},
	render () {
		if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
			return null;
		}
		return <h3 className="form-heading">{this.props.content}</h3>;
	},
});
