import PropTypes from 'prop-types';
import React from 'react';
import evalDependsOn from '../../../../../../fields/utils/evalDependsOn';

export default class extends React.Component {
    static displayName = 'FormHeading';

    static propTypes = {
		options: PropTypes.object,
	};

    render() {
		if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
			return null;
		}
		return <h3 className="form-heading">{this.props.content}</h3>;
	}
}
