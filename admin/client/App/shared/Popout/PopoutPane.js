/**
 * Render a popout pane, calls props.onLayout when the component mounts
 */

import PropTypes from 'prop-types';

import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

class PopoutPane extends React.Component {
    static displayName = 'PopoutPane';

    static propTypes = {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		onLayout: PropTypes.func,
	};

    static defaultProps = {
        onLayout: () => {},
    };

    componentDidMount() {
		this.props.onLayout(this.refs.el.offsetHeight);
	}

    render() {
		const className = classnames('Popout__pane', this.props.className);
		const props = blacklist(this.props, 'className', 'onLayout');

		return (
			<div ref="el" className={className} {...props} />
		);
	}
}

export default PopoutPane;
