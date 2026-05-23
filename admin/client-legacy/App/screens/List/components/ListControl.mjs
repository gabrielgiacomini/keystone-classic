import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ListControl = createReactClass({
	propTypes: {
		active: PropTypes.bool,
		dragSource: PropTypes.func,
		itemId: PropTypes.string,
		onClick: PropTypes.func,
		type: PropTypes.oneOf(['check', 'delete', 'sortable']).isRequired,
	},
	renderControl () {
		let icon = 'octicon octicon-';
		const className = classnames('ItemList__control ItemList__control--' + this.props.type, {
			'is-active': this.props.active,
		});
		const tabindex = this.props.type === 'sortable' ? -1 : null;

		if (this.props.type === 'check') {
			icon += 'check';
		}
		if (this.props.type === 'delete') {
			icon += 'trashcan';
		}
		if (this.props.type === 'sortable') {
			icon += 'three-bars';
		}

		const attrs = {
			'data-list-row-control': this.props.type,
			'data-item-id': this.props.itemId,
		};
		if (this.props.type === 'check') {
			attrs['data-list-row-select'] = true;
			attrs['aria-label'] = `Select row ${this.props.itemId}`;
		}
		if (this.props.type === 'delete') {
			attrs['data-list-row-delete'] = true;
			attrs['aria-label'] = `Delete row ${this.props.itemId}`;
		}

		const renderButton = (
			<button type="button" onClick={this.props.onClick} className={className} tabIndex={tabindex} {...attrs}>
				<span className={icon} />
			</button>
		);
		if (this.props.dragSource) {
			return this.props.dragSource(renderButton);
		} else {
			return renderButton;
		}
	},
	render () {
		const className = 'ItemList__col--control ItemList__col--' + this.props.type;

		return (
			<td className={className}>
				{this.renderControl()}
			</td>
		);
	},
});

export default ListControl;
