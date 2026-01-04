import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

class ListControl extends React.Component {
    static propTypes = {
		dragSource: PropTypes.func,
		onClick: PropTypes.func,
		type: PropTypes.oneOf(['check', 'delete', 'sortable']).isRequired,
	};

    renderControl = () => {
		var icon = 'octicon octicon-';
		var className = classnames('ItemList__control ItemList__control--' + this.props.type, {
			'is-active': this.props.active,
		});
		var tabindex = this.props.type === 'sortable' ? -1 : null;

		if (this.props.type === 'check') {
			icon += 'check';
		}
		if (this.props.type === 'delete') {
			icon += 'trashcan';
		}
		if (this.props.type === 'sortable') {
			icon += 'three-bars';
		}

		var renderButton = (
			<button type="button" onClick={this.props.onClick} className={className} tabIndex={tabindex}>
				<span className={icon} />
			</button>
		);
		if (this.props.dragSource) {
			return this.props.dragSource(renderButton);
		} else {
			return renderButton;
		}
	};

    render() {
		var className = 'ItemList__col--control ItemList__col--' + this.props.type;

		return (
			<td className={className}>
				{this.renderControl()}
			</td>
		);
	}
}

export default ListControl;
